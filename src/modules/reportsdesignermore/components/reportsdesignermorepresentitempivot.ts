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
 * @module ModuleReportsDesignerMore
 */
import {Component, Renderer2} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ReportsDesignerService} from "../../../modules/reportsdesigner/services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-more-present-item-pivot',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermorepresentitempivot.html',
    styles: ['.reports-designer-table-adjust-drag-placeholder .cdk-drag-placeholder {width: max-content; display: block;}']
})
export class ReportsDesignerMorePresentItemPivot {

    constructor(public language: language,
                public model: model,
                public renderer: Renderer2,
                public reportsDesignerService: ReportsDesignerService) {
    }

    /**
     * @return pivot: object
     */
    get advancedOptions(): any {
        return this.model.getField('presentation_params').pluginData.advancedOptions;
    }

    /**
     * @return pivot: object
     */
    get pivotRow() {
        return this.model.getField('presentation_params').pluginData.rowData;
    }

    /**
     * @return pivot: object
     */
    get pivotRowName() {
        return !!this.pivotRow ? this.language.getLabel(this.reportsDesignerService.listFields.find(field => field.fieldid == this.pivotRow).name) : '';
    }

    /**
     * @return pivot: object
     */
    get pivotColumns() {
        return this.model.getField('presentation_params').pluginData.columnData;
    }

    /**
     * @return pivot: object
     */
    get pivotValues() {
        return this.model.getField('presentation_params').pluginData.valueData;
    }

    /**
     * @return listfields: object[]
     */
    get availableListFields() {
        return this.reportsDesignerService.listFields.filter(field => {
            return this.pivotRow !== field.fieldid &&
                !this.pivotColumns.some(column => column.fieldid === field.fieldid) &&
                !this.pivotValues.some(value => value.fieldid === field.fieldid);
        });
    }

    public ngOnInit() {
        this.initializePluginData();
    }

    /**
     * initialize the plugin properties
     */
    public initializePluginData() {
        const presentationParams = this.model.getField('presentation_params');
        if (!presentationParams.pluginData.advancedOptions) {
            presentationParams.pluginData.advancedOptions = {};
        }
        if (!presentationParams.pluginData.columnData) {
            presentationParams.pluginData.columnData = [];
        }
        if (!presentationParams.pluginData.valueData) {
            presentationParams.pluginData.valueData = [];
        }
        if (!presentationParams.pluginData.rowData) {
            presentationParams.pluginData.rowData = '';
        }
    }

    /**
     * reset listFields sort priority as in the list
     * @param dragEvent: CdkDragDrop<any>
     */
    private onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            if (typeof dragEvent.container.data == 'string') {
                this.model.getField('presentation_params').pluginData.rowData = dragEvent.item.data.fieldid;
            } else {
                dragEvent.container.data.push({
                    id: dragEvent.item.data.id,
                    fieldid: dragEvent.item.data.fieldid,
                    name: dragEvent.item.data.name,
                });
            }

        }
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
     * delete selected item from list
     * @param arrayName: string
     * @param id: string
     */
    private deleteItem(arrayName, id) {
        const presentationParams = this.model.getField('presentation_params');
        if (arrayName == 'rowData') {
            presentationParams.pluginData.rowData = '';
        } else {
            presentationParams.pluginData[arrayName] = presentationParams.pluginData[arrayName].filter(item => item.id != id);
        }
    }
}
