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
export class ReportsDesignerManipulate {

    constructor(private language: language,
                private modelUtilities: modelutilities,
                private modal: modal,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
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
    private trackByFn(index, item) {
        return item.fieldid;
    }

    /**
    * @removePlaceHolderElement
    * @moveItemInArray? item in listFields
    * @splice listFields add newItem
    * @set listFields
    */
    private onDrop(dragEvent: CdkDragDrop<any>) {
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
