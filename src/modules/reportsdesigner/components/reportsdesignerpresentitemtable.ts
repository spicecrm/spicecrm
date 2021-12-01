/**
 * @module ModuleReportsDesigner
 */
import {Component, Input} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-present-item-table',
    templateUrl: '../templates/reportsdesignerpresentitemtable.html'
})
export class ReportsDesignerPresentItemTable {
    /**
     * show/hide function field
     */
    @Input() public showFunction: boolean = false;

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
    }

    /**
     * @return listfields: object[]
     */
    get listFields() {
        return this.reportsDesignerService.listFields;
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
     * @moveItemInArray item in group.conditions
     * @set listfield.sortpriority
     * @set listfields
     */
    public onDrop(dragEvent: CdkDragDrop<any>) {
        moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
        dragEvent.container.data = dragEvent.container.data.map((item, index) => {
            item.sortpriority = index;
            return item;
        });
        this.model.setField('listfields', dragEvent.container.data);
    }

    /**
     * @set field.link: string
     */
    public setFieldLink(field, value) {
        field.link = value ? 'yes' : 'no';
    }
}
