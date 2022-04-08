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
    templateUrl: '../templates/reportsdesignermanipulate.html'
})
export class ReportsDesignerManipulate {

    constructor(public language: language,
                public modelUtilities: modelutilities,
                public modal: modal,
                public model: model,
                public reportsDesignerService: ReportsDesignerService) {
    }

    /**
    * @set listfields
    */
    set listFields(value) {
        this.reportsDesignerService.listFields = value;
    }

    /**
    * @return listfields: any[]
    */
    get listFields() {
        return this.reportsDesignerService.listFields;
    }

    /**
    * @return treeCDKDragList: cdkDragList
    */
    get dragList() {
        return this.reportsDesignerService.treeCDKDragList;
    }

    /**
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFn(index, item) {
        return item.fieldid;
    }

    /**
    * @removePlaceHolderElement
    * @moveItemInArray? item in listFields
    * @splice listFields add newItem
    * @set listFields
    */
    public onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            let field = dragEvent.item.data;
            let newItem = this.generateNewItem(field, dragEvent.container.data.length + 1);
            dragEvent.container.data.splice(dragEvent.currentIndex, 0, newItem);
            this.addListItemToUnionFields(newItem);
        }

        dragEvent.container.data = dragEvent.container.data.map((item, index) => {
            item.sequence = index;
            return item;
        });
        this.listFields = dragEvent.container.data;
    }

    /**
    * @param listItem
    * @load unionModules
    * @load unionListFields
    * @define newItem
    * @push newItem to unionListFields
    * @set unionlistfields
    */
    public addListItemToUnionFields(listItem) {
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
    public deleteListItemToUnionFields(fieldId) {
        let unionListFields = this.model.getField('unionlistfields');
        if (!unionListFields || !unionListFields.length || unionListFields.length == 0) return;

        unionListFields = unionListFields.filter(field => field.fieldid != fieldId);
        this.model.setField('unionlistfields', unionListFields);
    }

    /**
    * @param field: object
     * @return newItem: object
     */
    public generateNewItem(field = null, sequence) {
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
    public deleteField(fieldId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                let listFields = this.listFields.slice();
                listFields = listFields.filter(field => field.fieldid != fieldId);
                this.listFields = listFields;
                this.deleteListItemToUnionFields(fieldId);
            }
        });
    }

    /**
    * @generate newFixedField
     * @push newFixedField to listFields
     * @set set listFields
     * @addListItemToUnionFields
     * @set expandedItemId
     */
    public addFixed() {
        let listFields = this.listFields.slice();
        const newFixedField = this.generateNewItem(null, listFields.length + 1);
        listFields.push(newFixedField);
        this.listFields = listFields;
        this.addListItemToUnionFields(newFixedField);
        this.reportsDesignerService.manipulateExpandedItemId = newFixedField.fieldid;
    }
}
