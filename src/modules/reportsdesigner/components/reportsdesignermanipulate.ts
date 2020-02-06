/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, ViewChild} from '@angular/core';
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

    /**
    * @set listfields
    */
    set listItems(value) {
        this.model.setField('listfields', value);
    }

    /**
    * @return listfields: any[]
    */
    get listItems() {
        let items = this.model.getField('listfields');
        return items && items.length ? items
            .sort((a, b) => !isNaN(parseInt(a.sequence, 10)) && !isNaN(parseInt(b.sequence, 10)) ? +a.sequence > +b.sequence ? 1 : -1 : 0) : [];
    }

    /**
    * @return treeCDKDragList: cdkDragList
    */
    get dragList() {
        return this.reportsDesignerService.treeCDKDragList;
    }

    /**
    * @set dropLists
    */
    public ngAfterViewInit() {
        this.reportsDesignerService.dropLists = [this.dropList];
    }

    /**
    * @rest dropLists
    */
    public ngOnDestroy() {
        this.reportsDesignerService.dropLists = [];
    }

    /**
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.fieldid;
    }

    /**
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
            this.addListItemToUnionFields(newItem);
        }

        listItems = listItems.map((item, index) => {
            item.sequence = index;
            return item;
        });
        this.listItems = listItems;
    }

    /**
    * @param listItem
    * @load unionModules
    * @load unionListFields
    * @define newItem
    * @push newItem to unionListFields
    * @set unionlistfields
    */
    private addListItemToUnionFields(listItem) {
        const unionModules = this.model.getField('union_modules');
        if (!unionModules || !unionModules.length || unionModules.length == 0) return;

        let unionListFields = this.model.getField('unionlistfields');
        if (!unionListFields || !unionListFields.length || unionListFields.length == 0) {
            unionListFields = [];
        }

        unionModules.forEach(unionModule => {
            let newItem = {
                fieldid: listItem.fieldid,
                joinid: unionModule.unionid,
                path: listItem.path,
                displaypath: '',
                unionfieldpath: '',
                unionfielddisplaypath: '',
                unionfieldname: '',
                unionfielddisplayname: '',
                name: listItem.name,
                fixedvalue: '',
                id: listItem.fieldid
            };
            unionListFields.push(newItem);
        });
        this.model.setField('unionlistfields', unionListFields);
    }

    /**
    * @param fieldId
    * @load unionListFields
    * @filter unionListFields from deleted item
    * @set unionlistfields
    */
    private deleteListItemToUnionFields(fieldId) {
        let unionListFields = this.model.getField('unionlistfields');
        if (!unionListFields || !unionListFields.length || unionListFields.length == 0) return;

        unionListFields = unionListFields.filter(field => field.fieldid != fieldId);
        this.model.setField('unionlistfields', unionListFields);
    }

    /**
    * @param field: object
     * @return newItem: object
     */
    private generateNewItem(field = null, sequence) {
        let id = this.reportsDesignerService.generateGuid();
        return {
            fieldid: id,
            path: field ? `${this.reportsDesignerService.getCurrentPath()}::${field.id}` : '',
            displaypath: field ? this.reportsDesignerService.getCurrentPath() : '',
            fieldname: field ? field.name : '',
            name: field ? field.label : 'new fixed field',
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

    /**
    * delete the record with the given index
    * @param fieldId: string
    */
    private deleteField(fieldId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                let listItems = this.listItems.slice();
                listItems = listItems.filter(field => field.fieldid != fieldId);
                this.listItems = listItems;
                this.deleteListItemToUnionFields(fieldId);
            }
        });
    }

    /**
    * @generate newFixedField
     * @push newFixedField to listItems
     * @set set listItems
     * @addListItemToUnionFields
     * @set expandedItemId
     */
    public addFixed() {
        let listItems = this.listItems.slice();
        const newFixedField = this.generateNewItem(null, listItems.length + 1);
        listItems.push(newFixedField);
        this.listItems = listItems;
        this.addListItemToUnionFields(newFixedField);
        this.reportsDesignerService.expandedItemId = newFixedField.fieldid;
    }
}
