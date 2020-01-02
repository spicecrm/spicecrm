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

    /*
    * @input listItem: any
    */
    @Input() private listItem: any = {};
    /*
    * @output onDelete: EventEmitter<void>
    */
    @Output() private onDelete: EventEmitter<void> = new EventEmitter<void>();
    private expanded: boolean = false;

    constructor(private language: language,
                private modelUtilities: modelutilities,
                private modal: modal,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
    }

    /*
     * @set jointype = 'yes' | 'no'
     */
    set groupBy(value) {
        this.listItem.groupby = value ? 'yes' : 'no';
    }

    /*
     * @return jointype: boolean
     */
    get groupBy() {
        return this.listItem.groupby == 'yes';
    }

    /*
     * @set jointype = 'required' | 'optional'
     */
    set joinType(value) {
        this.listItem.jointype = value ? 'required' : 'optional';
    }

    /*
     * @return jointype: boolean
     */
    get joinType() {
        return this.listItem.jointype == 'required';
    }

    /*
     * @param fieldId: string
     * @delete the record with the given index
     */
    private deleteField() {
        this.onDelete.emit();
    }

    /*
     * @set expandedItemId = fieldId | ''
     */
    private toggleExpand() {
        if (!this.reportsDesignerService.expertMode) return;
        this.reportsDesignerService.expandedItemId = this.reportsDesignerService.expandedItemId == this.listItem.fieldid ? '' : this.listItem.fieldid;
    }
}
