/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesigner.html',
})
export class ReportsDesigner implements OnDestroy {

    private subscriptions: Subscription = new Subscription();

    protected currentUnionListFields: any[] = [];
    private activeTab: 'details' | 'filter' | 'manipulate' | 'present' | 'visualize' | 'integrate' = 'manipulate';

    constructor(private language: language,
                private cdr: ChangeDetectorRef,
                private view: view,
                private router: Router,
                private model: model,
                private modal: modal,
                private metadata: metadata,
                private navigationtab: navigationtab,
                private activatedRoute: ActivatedRoute,
                private injector: Injector,
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
     * kill any subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * set the initial values for the report
     * @param data: object
     */
    protected setInitialValues(data) {

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
    private subscribeToActivatedRoute() {
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
    private save() {
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
    private openSelectModuleModal() {
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
