/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-tree',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignertree.html'
})
export class ReportsDesignerTree implements AfterViewInit {

    @ViewChild('dragList', {static: false}) private dragList;
    private filterKey: string = '';

    constructor(private language: language,
                private backend: backend,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
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

    /**
     * loads the fields for a given module
     * @param module the module
     */
    private getModuleFields(module) {
        this.reportsDesignerService.moduleFields = [];

        this.backend.getRequest('/dictionary/browser/' + module + '/fields')
            .subscribe(items => this.reportsDesignerService.moduleFields = items);
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
