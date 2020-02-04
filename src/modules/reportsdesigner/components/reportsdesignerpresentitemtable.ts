/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerPresentItemStandard} from "./reportsdesignerpresentitemstandard";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'reports-designer-present-item-table',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitemtable.html'
})
export class ReportsDesignerPresentItemTable {

    constructor(public language: language, public model: model) {
    }

    /**
     * @return listfields: object[]
     */
    get listFields() {
        return this.model.getField('listfields')
            .sort((a, b) => {
                if (!isNaN(parseInt(a.sortpriority, 10)) && !isNaN(parseInt(b.sortpriority, 10))) {
                    return +a.sortpriority > +b.sortpriority ? 1 : -1;
                } else {
                    return +a.sequence > +b.sequence ? 1 : -1;
                }
            });
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
     * @moveItemInArray item in group.conditions
     * @set listfield.sortpriority
     * @set listfields
     */
    private onDrop(dragEvent: CdkDragDrop<any>) {
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
    protected setFieldLink(field, value) {
        field.link = value ? 'yes' : 'no';
    }
}
