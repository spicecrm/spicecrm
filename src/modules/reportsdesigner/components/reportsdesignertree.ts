/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
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
export class ReportsDesignerTree implements AfterViewInit {

    protected modules: any[] = [];
    @ViewChild('dragList', {static: false}) private dragList;
    private filterKey: string = '';
    private isLoadingModuleFields: boolean = false;
    /*
    * @output onUnionDelete: string = unionId
    */
    @Output() private onUnionDelete: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language,
                private backend: backend,
                private model: model,
                private modal: modal,
                private metadata: metadata,
                private reportsDesignerService: ReportsDesignerService) {
    }

    /*
    * @return module: object
    */
    get canAdd() {
        const listFields = this.model.getField('listfields');
        return listFields && listFields.length && listFields.length > 0;
    }

    /*
    * @return module: object
    */
    get activeModule() {
        return this.reportsDesignerService.activeModule;
    }

    /*
    * @return modules: any[]
    */
    get unionModules() {
        const modules = this.model.getField('union_modules');
        return modules && modules.length ? modules : [];
    }

    /*
    * @return dropLists: string[] = cdkDragList element id
    */
    get dropLists() {
        return this.reportsDesignerService.dropLists;
    }

    /*
    * @return moduleFields: object[]
    */
    get reportFields() {
        return this.reportsDesignerService.moduleFields;
    }

    /*
    * @return filteredReportFields: object[]
    */
    get filteredReportFields() {
        return this.filterKey ? this.reportFields
            .filter(nodeFiled => {
                return nodeFiled.name.toLowerCase().includes(this.filterKey.toLowerCase()) ||
                    (nodeFiled.label && nodeFiled.label.toLowerCase().includes(this.filterKey.toLowerCase()));
            }) : this.reportFields;
    }

    /*
    * @set treeCDKDragList
    * @set availableModules
    */
    public ngAfterViewInit() {
        this.reportsDesignerService.treeCDKDragList = this.dragList;
    }

    /*
     * @param data
     * @set currentPath
     * @getModuleFields
     */
    private onItemSelection(data) {
        this.reportsDesignerService.currentPath = data.path;
        this.getModuleFields(data.module);
    }

    /*
     * @push module: object to union_modules
     * @set union_modules
     */
    private addUnionModule() {
        const modules = this.metadata.getModules();
        if (!modules) return;
        modules.sort();
        this.modal
            .prompt('input', this.language.getLabel('LBL_SELECT_A_MODULE'), this.language.getLabel('LBL_MODULE'), null, null, modules)
            .subscribe(index => {
                if (modules[index]) {
                    let unionModules = this.model.getField('union_modules');
                    if (!unionModules || !unionModules.length) unionModules = [];
                    let newItem = {unionid: this.model.generateGuid(), module: modules[index]};
                    unionModules.push(newItem);
                    this.model.setField('union_modules', unionModules);
                    this.setActiveModule(newItem);
                }
            });
    }

    /*
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
                    unionModules[unionModules.length - 1] : {unionid: 'root', module: this.model.getField('report_module')};
                this.setActiveModule(selectedModule);
                this.onUnionDelete.emit(id);
            }
        });
    }

    /**
     * loads the fields for a given module
     * @param module the module
     */
    private getModuleFields(module) {
        this.reportsDesignerService.moduleFields = [];
        this.isLoadingModuleFields = true;
        this.backend.getRequest('/dictionary/browser/' + module + '/fields')
            .subscribe(items => {
                this.reportsDesignerService.moduleFields = items;
                this.isLoadingModuleFields = false;
            });
    }

    /*
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

    /*
    * @removePlaceHolderElement
    */
    private dropEntered(e) {
        this.reportsDesignerService.removePlaceHolderElement(e.container.element.nativeElement);
    }

    /*
    * @set currentModule
    */
    private setActiveModule(selectedModule?) {
        this.reportsDesignerService.activeModule = selectedModule ?
            selectedModule : {unionid: 'root', module: this.model.getField('report_module')};
        this.reportsDesignerService.moduleFields = [];
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.id;
    }
}
