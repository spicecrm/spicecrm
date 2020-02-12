/**
 * @module ModuleReportsDesigner
 */
import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {reporterconfig} from "../../reports/services/reporterconfig";
import {view} from "../../../services/view.service";
import {ActivatedRoute, Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {ReportsDesignerManipulate} from "./reportsdesignermanipulate";

@Component({
    selector: 'reports-designer',
    providers: [
        ReportsDesignerService,
        reporterconfig,
        view,
        model
    ],
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesigner.html',
})
export class ReportsDesigner {

    private activeTab: 'details' | 'filter' | 'manipulate' | 'present' | 'visualize' | 'integrate' = 'manipulate';
    protected currentUnionListFields: any[] = [];

    constructor(private language: language,
                private cdr: ChangeDetectorRef,
                private view: view,
                private router: Router,
                private model: model,
                private modal: modal,
                private metadata: metadata,
                private activatedRoute: ActivatedRoute,
                private reportsDesignerService: ReportsDesignerService) {
        this.model.module = 'KReports';
        this.subscribeToActivatedRoute();
    }

    /**
    * force detect changes to prevent angular change detection error
    * @setEditMode
    */
    public ngAfterViewInit() {
        this.view.setEditMode();
        this.view.isEditable = true;
        this.cdr.detectChanges();
    }

    /**
    * @model.initialize
    * @set model.id
    * @model.getData
    * @openSelectModuleModal
    * @set currentPath
    * @set activeModule
    */
    private subscribeToActivatedRoute() {
        this.activatedRoute.params.subscribe(params => {
            if (!params.id || params.id.length == 0) return;
            if (params.id == 'new') {
                this.openSelectModuleModal();
            } else {
                this.model.id = params.id;
                this.model.getData()
                    .subscribe(res => {
                        if (!res.report_module || res.report_module.length == 0) {
                            this.openSelectModuleModal();
                            this.activeTab = 'details';
                        } else {
                            const module = this.model.getField('report_module');
                            this.reportsDesignerService.setCurrentPath(module, module);
                            this.reportsDesignerService.activeModule = {unionid: 'root', module: res.report_module};
                        }
                        if (!res.listfields) this.model.setField('listfields', []);
                    });
            }
        });
    }

    /**
    * @set activeTab
    */
    private setActiveTab(tab) {
        if ((this.activeTab == 'details' && !this.model.validate()) || ((tab == 'present' || tab == 'visualize') && this.reportsDesignerService.listFields.length == 0)) return;
        this.activeTab = tab;
    }

    /**
    * @navigate to listView
    */
    private goToModule() {
        this.router.navigate(['/module/KReports']);
    }

    /**
    * @navigate to Record in view mode or to list view
    */
    private cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
        this.router.navigate(['/module/KReports/' + (this.model.isNew ? '' : this.model.id)]);
    }

    /**
    * @model.save
     * @set view mode
     * @navigate to Record in view mode or to list view
     */
    private save() {
        if (this.model.validate()) {
            this.model.save(true)
                .subscribe(() => {
                    this.view.setViewMode();
                    this.router.navigate(['/module/KReports/' + this.model.id]);
                });
        }
    }

    /**
    * @prompt modules list
     * @pass modules
     * @set report_module
     * @set currentPath
     * @set activeTab
     * @set activeModule
     */
    private openSelectModuleModal() {
        let modules = this.metadata.getModules();
        if (!modules) return;

        modules.sort();
        this.modal
            .prompt('input', this.language.getLabel('LBL_SELECT_A_MODULE'), this.language.getLabel('LBL_MODULE'), null, null, modules)
            .subscribe(index => {
                if (modules[index]) {
                    this.model.initialize();
                    this.setInitialValues(modules[index]);
                    this.reportsDesignerService.setCurrentPath(modules[index], modules[index]);
                    this.activeTab = 'details';
                    this.reportsDesignerService.activeModule = {unionid: 'root', module: modules[index]};
                } else {
                    this.cancel();
                }
            });
    }

    /**
     * set the initial values for the report
     * @param reportModule: string
     */
    protected setInitialValues(reportModule) {
        this.model.setFields({
            report_module: reportModule,
            listfields: [],
            listtype: 'standard',
            presentation_params: {
                plugin: 'standard',
                pluginData: {
                    standardViewProperties:{
                        processCount:'Synchronous',
                        listEntries:25
                    }
                }
            }
        });
    }

    /**
    * @cleanWhereGroups
     * @cleanUnionListFields
     */
    private handleUnionDelete(unionId) {
        this.cleanWhereGroups(unionId);
        this.cleanUnionListFields(unionId);
    }

    /**
    * @param fields: object[]
     * @set currentUnionListFields
     */
    private handleUnionAdd(fields) {
        this.currentUnionListFields = fields;
    }

    /**
    * @param unionId: string
     * @filter whereGroups from deleted groups
     * @set wheregroups
     */
    private cleanWhereGroups(unionId) {
        let whereGroups = this.model.getField('wheregroups');
        if (whereGroups && whereGroups.length) {
            whereGroups = whereGroups.filter(group => group.unionid != unionId);
            this.model.setField('wheregroups', whereGroups);
            this.cleanWhereConditions(whereGroups);
        }
    }

    /**
    * @param whereGroups: object[]
     * @filter whereConditions from deleted conditions
     * @set whereconditions
     */
    private cleanWhereConditions(whereGroups) {
        let whereConditions = this.model.getField('whereconditions');
        if (!whereConditions || !whereConditions.length) return;
        whereConditions = whereConditions.filter(condition => whereGroups.some(group => group.id == condition.groupid));
        this.model.setField('whereconditions', whereConditions);
    }

    /**
    * @param unionId: string
     * @filter unionListFields from deleted fields
     * @set unionlistfields
     */
    private cleanUnionListFields(unionId) {
        let unionListFields = this.model.getField('unionlistfields');
        if (!unionListFields || !unionListFields.length) return;
        unionListFields = unionListFields.filter(field => field.joinid != unionId);
        this.model.setField('unionlistfields', unionListFields);
    }
}
