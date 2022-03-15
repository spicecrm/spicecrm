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
    templateUrl: '../templates/reportsdesignertree.html'
})
export class ReportsDesignerTree {

    public modules: any[] = [];
    public filterKey: string = '';
    public isLoadingModuleFields: boolean = false;
    public reportModuleFields: any = {};

    /**
    * @output onUnionDelete: EventEmitter<string> = unionId
     */
    @Output() public onUnionDelete: EventEmitter<string> = new EventEmitter<string>();
    /**
    * @output onUnionAdd: object[] = currentUnionFields
     */
    @Output() public onUnionAdd: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language,
                public backend: backend,
                public model: model,
                public modal: modal,
                public metadata: metadata,
                public cdr: ChangeDetectorRef,
                public injector: Injector,
                public reportsDesignerService: ReportsDesignerService) {
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
    public onItemSelection(data, rootModule) {
        this.reportsDesignerService.setCurrentPath(rootModule, data.path);
        this.getModuleFields(data.module, rootModule);
    }

    /**
    * @return filteredReportFields: object[]
     */
    public getFilteredReportFields(reportFields) {
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
    public addUnionModule() {
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
    public deleteUnionModule(id) {
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
    public initializeUnionListFields(unionId) {
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
    public getModuleFields(forModule, rootModule) {
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
    public dropExited(e) {
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
    public dropEntered(e) {
        this.reportsDesignerService.removePlaceHolderElement(e.container.element.nativeElement);
    }

    /**
    * @set currentModule
     */
    public setActiveModule(selectedModule) {
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
    public setCurrentUnionListFields(unionId) {
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
    public trackByFn(index, item) {
        return index;
    }
}
