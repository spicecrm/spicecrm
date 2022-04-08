/**
 * @module ModuleReportsDesigner
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from "../../../services/language.service";

@Component({
    selector: '[reports-designer-manipulate-union-table-row]',
    templateUrl: '../templates/reportsdesignermanipulateuniontablerow.html'
})
export class ReportsDesignerManipulateUnionTableRow {

    /**
    * @input listItem: any
    */
    @Input() public listItem: any = {};
    /**
    * @output onDelete: EventEmitter<void>
    */
    @Output() public onUnlink: EventEmitter<void> = new EventEmitter<void>();

    constructor(public language: language) {
    }

    get path() {
        return !!this.listItem.path && this.listItem.path.length > 0 ? this.listItem.path : 'FIXED';
    }

    get isLinked() {
        return !!this.listItem.unionfieldpath && this.listItem.unionfieldpath.length > 0;
    }

    /**
    * @param fieldId: string
     * @delete the record with the given index
     */
    public unlinkField() {
        this.onUnlink.emit();
    }
}
