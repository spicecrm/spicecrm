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
import {Component, Input, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

/**
 * renders a selection dialog for the list of modules and also in case of a new report the name
 */
@Component({
    selector: 'reports-designer-select-module-modal',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerselectmodulemodal.html',
})
export class ReportsDesignerSelectModuleModal implements OnInit {

    /**
     *
     */
    @Input() public createmode: boolean = false;

    /**
     * the list of modules, retrieved on Init and then potentially filtered
     */
    protected moduleList: any[] = [];

    /**
     * the filtered module list
     */
    protected filteredModuleList: any[] = [];


    private subject: Subject<any> = new Subject<any>();
    /**
     * @observable response: {name: string, module: string}
     */
    public response: Observable<any> = this.subject.asObservable();

    /**
     * reference to self as the widnwo to enable the modal to close itself
     */
    private self: any = {};

    /**
     * the name of the report
     */
    private reportName: string = '';

    /**
     * the selected module
     */
    private selectedModule: string = '';

    /**
     * the search term held internally
     */
    private _searchTerm: string = '';

    /**
     * the fieldset from the config to be rendered
     */
    private fieldset: string;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view) {

        // set the view to editable and set the name field as default focus field
        this.view.isEditable = true;
        this.view.setEditMode();
        this.view.editfieldname = 'name';
    }


    /**
     * the getter for the searchterm
     */
    get searchTerm() {
        return this._searchTerm;
    }

    /**
     * set searchTerm and reassign the filteredModuleList
     * @param value: string
     */
    set searchTerm(value) {
        this.filteredModuleList = this.moduleList.filter(item => item.display.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }

    /**
     * @return disabled: boolean
     */
    get disabled() {
        return !(!!this.reportName && !!this.selectedModule);
    }

    public ngOnInit() {
        // get the list of modules
        this.loadModuleList();

        // load the component conf
        let componentConf = this.metadata.getComponentConfig('ReportsDesignerSelectModuleModal', this.model.module);
        this.fieldset = componentConf.fieldset;
    }

    /**
     * get modules from metadata and filter them
     */
    private loadModuleList() {
        this.moduleList = this.metadata.getModules()
            .map(module => ({name: module, display: this.language.getModuleName(module)}))
            .sort((a, b) => a.display > b.display ? 1 : -1);

        this.filteredModuleList = this.moduleList;
    }

    /**
     * set module value
     * @param module: string
     */
    private setSelectedModule(module) {
        this.selectedModule = module;
        if (!this.createmode) {
            this.confirm();
        }
    }

    /**
     * destroy the modal
     */
    private close() {
        this.subject.next(false);
        this.subject.complete();
        this.self.destroy();
    }


    /**
     * submit values and close the modal. Tis can also add the module name in case of a dblclick
     *
     * @param module
     */
    private confirm(module?) {
        if (module) {
            this.setSelectedModule(module);
        }
        if (this.canCreate) {
            this.subject.next({
                name: this.reportName,
                module: this.selectedModule
            });
            this.subject.complete();
            this.close();
        }
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item
     */
    private trackByFn(index, item) {
        return item;
    }

    /**
     * a getter that checks if the report can be create ot the module can be added
     */
    get canCreate() {
        return !this.createmode || this.model.getField('name')?.length > 0;
    }
}
