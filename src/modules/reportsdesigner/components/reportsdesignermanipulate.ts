/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, Component, Input, OnDestroy, ViewChild} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {modelutilities} from "../../../services/modelutilities.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-manipulate',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignermanipulate.html'
})
export class ReportsDesignerManipulate implements AfterViewInit, OnDestroy {

    @ViewChild('dropList', {static: false}) private dropList;

    constructor(private language: language,
                private modelUtilities: modelutilities,
                private modal: modal,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
    }

    /*
    * @set listfields
    */
    set listItems(value) {
        this.model.setField('listfields', value);
    }

    /*
    * @return listfields: any[]
    */
    get listItems() {
        let items = this.model.getField('listfields');
        return items && items.length ? items.sort((a,b) => +a.sequence > +b.sequence ? 1 : -1) : [];
    }

    /*
    * @return treeCDKDragList: cdkDragList
    */
    get dragList() {
        return this.reportsDesignerService.treeCDKDragList;
    }

    /*
    * @set dropLists
    */
    public ngAfterViewInit() {
        this.reportsDesignerService.dropLists = [this.dropList];
    }

    /*
    * @rest dropLists
    */
    public ngOnDestroy() {
        this.reportsDesignerService.dropLists = [];
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.fieldid;
    }

    /*
    * @removePlaceHolderElement
    * @moveItemInArray? item in listItems
    * @splice listItems add newItem
    * @set listItems
    */
    private onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);
        let listItems = this.listItems.slice();

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(listItems, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            let field = dragEvent.item.data;
            let newItem = this.generateNewItem(field, listItems.length + 1);
            listItems.splice(dragEvent.currentIndex, 0, newItem);
        }

        listItems = listItems.map((item, index) => {
            item.sequence = index;
            return item;
        });
        this.listItems = listItems;
    }

    /*
     * @param field: object
     * @return newItem: object
     */
    private generateNewItem(field, sequence) {
        let id = this.reportsDesignerService.generateGuid();
        return {
            fieldid: id,
            path: `${this.reportsDesignerService.currentPath}::${field.id}`,
            displaypath: this.reportsDesignerService.currentPath,
            fieldname: field.name,
            name: field.label,
            display: 'yes',
            sequence: sequence,
            width: '100',
            sort: '-',
            sortpriority: '',
            jointype: 'optional',
            sqlfunction: '-',
            summaryfunction: '',
            groupby: 'no',
            link: 'no',
            fixedvalue: '',
            formulasequence: '',
            id: id
        };
    }

    /*
     * @param fieldId: string
     * @delete the record with the given index
     */
    private deleteField(fieldId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                let listItems = this.listItems.slice();
                listItems = listItems.filter(field => field.fieldid != fieldId);
                this.listItems = listItems;
                let unionListItems = this.model.getField('unionlistfields');
                if (!unionListItems || !unionListItems.length) return;
            }
        });
    }
}
