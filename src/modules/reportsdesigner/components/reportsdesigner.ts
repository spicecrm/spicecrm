/**
 * @module ModuleReportsDesigner
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {reporterconfig} from "../../reports/services/reporterconfig";
import {view} from "../../../services/view.service";
import {ActivatedRoute, Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'reports-designer',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesigner.html',
    providers: [
        ReportsDesignerService,
        reporterconfig,
        view,
        model
    ]
})
export class ReportsDesigner {

    private activeTab: string = 'manipulate';

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

    /*
    * force detect changes to prevent angular change detection error
    * @setEditMode
    */
    public ngAfterViewInit() {
        this.view.setEditMode();
        this.view.isEditable = true;
        this.cdr.detectChanges();
    }

    /*
    * @model.initialize
    * @set model.id
    * @model.getData
    * @openSelectModuleModal
    * @set currentPath
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
                            this.reportsDesignerService.currentPath = this.model.getField('report_module');
                        }
                    });
            }
        });
    }

    /*
    * @set activeTab
    */
    private setActiveTab(tab) {
        if (this.activeTab == 'details' && !this.model.validate()) return;
        this.activeTab = tab;
    }

    /*
    * @navigate to listView
    */
    private goToModule() {
        this.router.navigate(['/module/KReports']);
    }

    /*
    * @navigate to Record in view mode or to list view
    */
    private cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
        this.router.navigate(['/module/KReports/' + (this.model.isNew ? '' : this.model.id)]);
    }

    /*
     * @model.save
     * @set view mode
     * @navigate to Record in view mode or to list view
     */
    private save() {
        if (this.model.validate()) {
            this.model.save()
                .subscribe(() => {
                    this.view.setViewMode();
                    this.router.navigate(['/module/KReports/' + this.model.id]);
                });
        }
    }

    /*
     * @prompt modules list
     * @pass modules
     * @set report_module
     * @set currentPath
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
                    this.model.setField('report_module', modules[index]);
                    this.reportsDesignerService.currentPath = modules[index];
                    this.activeTab = 'details';
                } else {
                    this.cancel();
                }
            });
    }
}
