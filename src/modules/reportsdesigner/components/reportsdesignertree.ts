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
import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild, Injector} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'reports-designer-tree',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignertree.html'
})
export class ReportsDesignerTree {

    protected modules: any[] = [];
    private filterKey: string = '';
    private isLoadingModuleFields: boolean = false;
    private reportModuleFields: any = {};

    /**
    * @output onUnionDelete: EventEmitter<string> = unionId
     */
    @Output() private onUnionDelete: EventEmitter<string> = new EventEmitter<string>();
    /**
    * @output onUnionAdd: object[] = currentUnionFields
     */
    @Output() private onUnionAdd: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language,
                private backend: backend,
                private model: model,
                private modal: modal,
                private metadata: metadata,
                private cdr: ChangeDetectorRef,
                private injector: Injector,
                private reportsDesignerService: ReportsDesignerService) {
    }

    /**
    * @return module: object
     */
    get canAdd() {
        const listFields = this.model.getField('listfields');
        return listFields && listFields.length && listFields.length > 0;
    }

    /**
    * @return module: object
     */
    get activeModule() {
        return this.reportsDesignerService.activeModule;
    }

    /**
    * @return module: object
     */
    get allModules() {
        return [{module: this.model.getField('report_module'), unionid: 'root'}, ...this.unionModules];
    }

    /**
    * @return modules: any[]
     */
    get unionModules() {
        const modules = this.model.getField('union_modules');
        return modules && modules.length ? modules : [];
    }

    /**
    * @param data: object
    * @param rootModule: string
     * @set currentPath
     * @getModuleFields
     */
    private onItemSelection(data, rootModule) {
        this.reportsDesignerService.setCurrentPath(rootModule, data.path);
        this.getModuleFields(data.module, rootModule);
    }

    /**
    * @return filteredReportFields: object[]
     */
    private getFilteredReportFields(reportFields) {
        return !this.filterKey ? reportFields : reportFields
            .filter(nodeFiled => {
                return nodeFiled.name.toLowerCase().includes(this.filterKey.toLowerCase()) ||
                    (nodeFiled.label && this.language.getLabel(nodeFiled.label).toLowerCase().includes(this.filterKey.toLowerCase()));
            });
    }

    /**
    * @push module: object to union_modules
     * @set union_modules
     */
    private addUnionModule() {
        this.modal.openModal('ReportsDesignerSelectModuleModal', true, this.injector)
            .subscribe(modalRef => {
                modalRef.instance.response.subscribe(response => {
                    if (response) {
                        let unionModules = this.model.getField('union_modules');
                        if (!unionModules || !unionModules.length) unionModules = [];
                        let newItem = {unionid: this.reportsDesignerService.generateGuid(), module: response.module};
                        unionModules.push(newItem);
                        this.model.setField('union_modules', unionModules);
                        this.initializeUnionListFields(newItem.unionid);
                        this.setActiveModule(newItem);
                    }
                });
            });
    }

    /**
    * @filter union_modules from deleted
     * @set union_modules
     * @setActiveModule
     * @emit unionId by onUnionDelete
     */
    private deleteUnionModule(id) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                let unionModules = this.model.getField('union_modules');
                unionModules = unionModules.filter(module => module.unionid != id);
                this.model.setField('union_modules', unionModules);
                const selectedModule = unionModules.length > 0 ?
                    unionModules[unionModules.length - 1] : {
                        unionid: 'root',
                        module: this.model.getField('report_module')
                    };
                this.setActiveModule(selectedModule);
                this.onUnionDelete.emit(id);
            }
        });
    }

    /**
    * loads the fields for a given module
     * @param unionId: string
     */
    private initializeUnionListFields(unionId) {
        const unionListFields = this.model.getField('unionlistfields');
        const listFields = this.model.getField('listfields');
        let newUnionListFields = listFields
            .slice()
            .map(field => {
                field = {
                    fieldid: field.fieldid,
                    joinid: unionId,
                    path: field.path,
                    displaypath: '',
                    unionfieldpath: '',
                    unionfielddisplaypath: '',
                    unionfieldname: '',
                    unionfielddisplayname: '',
                    name: field.name,
                    fixedvalue: '',
                    id: field.fieldid
                };
                return field;
            });
        if (!!unionListFields && unionListFields.length && unionListFields.length > 0) {
            newUnionListFields = [...unionListFields, ...newUnionListFields];
        }
        this.model.setField('unionlistfields', newUnionListFields);
    }

    /**
    * loads the fields for a given module
     * @param forModule: string
     * @param rootModule: object
     * @set isLoadingModuleFields
     * @set reportModuleFields[rootModule]
     */
    private getModuleFields(forModule, rootModule) {
        this.reportModuleFields[rootModule] = [];
        this.isLoadingModuleFields = true;
        this.cdr.detectChanges();
        this.backend.getRequest('dictionary/browser/' + forModule + '/fields')
            .subscribe(items => {
                this.reportModuleFields[rootModule] = items.filter(item => item.type != 'relate' && item.source != 'non-db');
                this.isLoadingModuleFields = false;
            });
    }

    /**
    * placeholder to keep space reserved for the dragged element in its origin
     * @create dragPlaceHolderNode
     * @set dragPlaceHolderNode
     * @insertBefore tr in origin container
     */
    private dropExited(e) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.colSpan = 10;
        td.innerHTML = '&nbsp;';
        td.style.background = '#fff';
        tr.appendChild(td);
        this.reportsDesignerService.dragPlaceHolderNode = tr;
        let index = e.container.data.findIndex(item => item.id == e.item.data.id);
        if (index > -1) {
            e.container.element.nativeElement.insertBefore(tr, e.container.element.nativeElement.children[index]);
        }
    }

    /**
    * @removePlaceHolderElement
     */
    private dropEntered(e) {
        this.reportsDesignerService.removePlaceHolderElement(e.container.element.nativeElement);
    }

    /**
    * @set currentModule
     */
    private setActiveModule(selectedModule) {
        this.reportsDesignerService.activeModule = selectedModule;
        if (!this.reportsDesignerService.getCurrentPath(selectedModule.module)) {
            this.reportsDesignerService.setCurrentPath(selectedModule.module, selectedModule.module);
        }
        this.setCurrentUnionListFields(selectedModule.unionid);
    }

    /**
    * @param unionId
     * @filter unionlistfields by unionId
     * @set currentUnionListFields
     */
    private setCurrentUnionListFields(unionId) {
        let unionListFields = this.model.getField('unionlistfields');
        unionListFields = !!unionListFields && unionListFields.length ? unionListFields : [];
        this.onUnionAdd.emit(unionListFields.filter(field => field.joinid == unionId));
    }

    /**
    * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    private trackByFn(index, item) {
        return index;
    }
}
