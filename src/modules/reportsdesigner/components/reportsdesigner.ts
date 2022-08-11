/**
 * @module ModuleReportsDesigner
 */
import {ChangeDetectorRef, Component, Injector, OnDestroy} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {reporterconfig} from "../../../modules/reports/services/reporterconfig";
import {view} from "../../../services/view.service";
import {ActivatedRoute, Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {metadata} from "../../../services/metadata.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'reports-designer',
    providers: [
        ReportsDesignerService,
        reporterconfig,
        view,
        model
    ],
    templateUrl: '../templates/reportsdesigner.html',
})
export class ReportsDesigner implements OnDestroy {

    public subscriptions: Subscription = new Subscription();

    public currentUnionListFields: any[] = [];
    public activeTab: 'details' | 'filter' | 'manipulate' | 'present' | 'visualize' | 'integrate' = 'manipulate';

    constructor(public language: language,
                public cdr: ChangeDetectorRef,
                public view: view,
                public router: Router,
                public model: model,
                public modal: modal,
                public metadata: metadata,
                public navigationtab: navigationtab,
                public activatedRoute: ActivatedRoute,
                public injector: Injector,
                public reportsDesignerService: ReportsDesignerService) {
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
     * kill any subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * set the initial values for the report
     * @param data: object
     */
    public setInitialValues(data) {

        const statusFieldDefs = this.metadata.getFieldDefs(this.model.module, 'report_status');
        this.model.setFields({
            report_module: data.module,
            listfields: [],
            report_status: statusFieldDefs.default || '1',
            whereconditions: [],
            listtype: 'standard',
            presentation_params: {
                plugin: 'standard',
                pluginData: {
                    standardViewProperties: {
                        processCount: 'Synchronous',
                        listEntries: 25
                    }
                }
            }
        });
    }

    /**
     * @model.initialize
     * @set model.id
     * @model.getData
     * @openSelectModuleModal
     * @set currentPath
     * @set activeModule
     */
    public subscribeToActivatedRoute() {
        this.subscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route => {
                const params = route.params;
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
                            if (!res.whereconditions) this.model.setField('whereconditions', []);

                            // set the tab info
                            this.navigationtab.setTabInfo({displayname: this.model.getField('name'), displaymodule: this.model.module});
                        });
                }
            })
        );
    }

    /**
     * @set activeTab
     */
    public setActiveTab(tab) {
        if ((this.activeTab == 'details' && !this.model.validate()) || ((tab == 'present' || tab == 'visualize') && this.reportsDesignerService.listFields.length == 0)) return;
        this.activeTab = tab;
    }

    /**
     * @navigate to listView
     */
    public goToModule() {
        this.router.navigate(['/module/KReports']);
    }

    /**
     * @navigate to Record in view mode or to list view
     */
    public cancel() {
        // if we have a new tab .. close the tab
        if(this.model.isNew) this.navigationtab.closeTab();

        // cancel edit and set view mode
        this.model.cancelEdit();
        this.view.setViewMode();

        // close the tab
        this.navigationtab.closeTab();

        // route away
        this.router.navigate(['/module/KReports/' + (this.model.isNew ? '' : this.model.id)]);
    }

    /**
     * @model.save
     * @set view mode
     * @navigate to Record in view mode or to list view
     */
    public save() {
        if (this.model.validate()) {
            this.model.save(true)
                .subscribe(() => {
                    // set to view mode
                    this.view.setViewMode();

                    // close the tab
                    this.navigationtab.closeTab();

                    // route away
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
    public openSelectModuleModal() {
        this.model.initialize();
        this.modal.openModal('ReportsDesignerSelectModuleModal', true, this.injector)
            .subscribe(modalRef => {
                modalRef.instance.createmode = true;
                modalRef.instance.response.subscribe(response => {
                    if (response) {
                        this.setInitialValues(response);
                        this.reportsDesignerService.setCurrentPath(response.module, response.module);
                        this.reportsDesignerService.activeModule = {unionid: 'root', module: response.module};
                        this.navigationtab.setTabInfo({displayname: this.model.getField('name'), displaymodule: this.model.module});
                    } else {
                        this.navigationtab.closeTab();
                        this.cancel();
                    }
                });
            });
    }

    /**
     * @cleanWhereGroups
     * @cleanUnionListFields
     */
    public handleUnionDelete(unionId) {
        this.cleanWhereGroups(unionId);
        this.cleanUnionListFields(unionId);
    }

    /**
     * @param fields: object[]
     * @set currentUnionListFields
     */
    public handleUnionAdd(fields) {
        this.currentUnionListFields = fields;
    }

    /**
     * @param unionId: string
     * @filter whereGroups from deleted groups
     * @set wheregroups
     */
    public cleanWhereGroups(unionId) {
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
    public cleanWhereConditions(whereGroups) {
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
    public cleanUnionListFields(unionId) {
        let unionListFields = this.model.getField('unionlistfields');
        if (!unionListFields || !unionListFields.length) return;
        unionListFields = unionListFields.filter(field => field.joinid != unionId);
        this.model.setField('unionlistfields', unionListFields);
    }
}
