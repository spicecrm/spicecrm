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
    templateUrl: '../templates/reportsdesignermanipulatetablerow.html'
})
export class ReportsDesignerManipulateTableRow {

    /**
    * @input listItem: any
    */
    @Input() public listItem: any = {};
    /**
    * @output onDelete: EventEmitter<void>
    */
    @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();

    constructor(public language: language,
                public modelUtilities: modelutilities,
                public modal: modal,
                public model: model,
                public reportsDesignerService: ReportsDesignerService) {
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
    public deleteField() {
        this.onDelete.emit();
    }

    /**
    * @set expandedItemId = fieldId | ''
     */
    public toggleExpand(e: MouseEvent) {
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
