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
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {modelutilities} from "../../../services/modelutilities.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";

@Component({
    selector: '[reports-designer-manipulate-table-row]',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignermanipulatetablerow.html'
})
export class ReportsDesignerManipulateTableRow {

    /**
    * @input listItem: any
    */
    @Input() private listItem: any = {};
    /**
    * @output onDelete: EventEmitter<void>
    */
    @Output() private onDelete: EventEmitter<void> = new EventEmitter<void>();

    constructor(private language: language,
                private modelUtilities: modelutilities,
                private modal: modal,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
    }

    /**
    * @param value: string
     * @set name
     */
    set name(value) {
        this.listItem.name = value;
        let unionListFields = this.model.getField('unionlistfields');
        if (!unionListFields || !unionListFields.length || unionListFields.length == 0) return;

        unionListFields.forEach(field => {
           if (field.fieldid == this.listItem.fieldid) {
               field.name = value;
               return true;
           }
        });
        this.model.setField('unionlistfields', unionListFields);
    }

    /**
    * @return name: string
     */
    get name() {
        return this.listItem.name;
    }

    /**
    * @param value: boolean
     * @set jointype = 'yes' | 'no'
     */
    set groupBy(value) {
        this.listItem.groupby = value ? 'yes' : 'no';
    }

    /**
    * @return jointype: boolean
     */
    get groupBy() {
        return this.listItem.groupby == 'yes';
    }

    /**
    * @param value boolean
     * @set jointype = 'required' | 'optional'
     */
    set joinType(value) {
        this.listItem.jointype = value ? 'required' : 'optional';
    }

    /**
    * @return jointype: boolean
     */
    get joinType() {
        return this.listItem.jointype == 'required';
    }

    get displayPath() {
        return !!this.listItem.displaypath && this.listItem.displaypath.length > 0 ? this.listItem.displaypath : 'FIXED';
    }
    /**
    * @param fieldId: string
     * @delete the record with the given index
     */
    private deleteField() {
        this.onDelete.emit();
    }

    /**
    * @set expandedItemId = fieldId | ''
     */
    private toggleExpand(e: MouseEvent) {
        e.stopPropagation();

        if (!this.reportsDesignerService.expertMode) return;
        this.reportsDesignerService.manipulateExpandedItemId = this.reportsDesignerService.manipulateExpandedItemId == this.listItem.fieldid ? '' : this.listItem.fieldid;
    }

    /**
     * disable the required checkbox if we are on a root elemet
     */
    get requiredEnabled(){
        return this.listItem.path.split('::').length > 2;
    }
}
