/**
 * @module ObjectComponents
 */
import {Component, Input, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {SystemResizeDirective} from "../../directives/directives/systemresize";
import {layout} from "../../services/layout.service";

/**
 * renders the header row for a list view table
 */
@Component({
    selector: '[object-list-header]',
    templateUrl: './src/objectcomponents/templates/objectlistheader.html',
    providers: [view]
})
export class ObjectListHeader {

    @ViewChildren(SystemResizeDirective) private resizeElements: QueryList<SystemResizeDirective>;

    /**
     * an action set ot be applied to the list actions
     */
    @Input() private actionset: string = '';

    /**
     * show the select column as first column
     */
    @Input() private showSelectColumn: boolean = true;

    /**
     * display the row action menu or hide the column
     */
    @Input() private showRowActionMenu: boolean = true;

    constructor(private modellist: modellist, private language: language, private view: view, private elementRef: ElementRef, private layout: layout) {
        this.view.labels = 'short';
    }

    /**
     * returns if the layout is set to small
     */
    get isSmall() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * returns the listfields
     */
    get listfields() {
        return this.modellist.listfields;
    }

    /**
     * a getter to return the module from the modellist service
     */
    get module() {
        return this.modellist.module;
    }

    /**
     * return the column width if set
     * @param columnId
     */
    private columnWidth(columnId?) {
        let listfield = this.listfields.find(lf => lf.id == columnId);
        return listfield.width ? listfield.width + '%' : (100 / this.listfields.length) + '%';
    }

    /**
     * returns if a given fielsd is set sortable in teh fieldconfig
     *
     * @param field the field from the fieldset
     */
    private isSortable(field): boolean {
        if (field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets the field as sort parameter
     *
     * @param field the field from the fieldset
     */
    private setSortField(field): void {
        if (this.isSortable(field)) {
            this.modellist.setSortField(field.field);
        }
    }

    private onresize(e) {
        let elementWidths = {};
        let totalwidth = 0;

        this.resizeElements.forEach(element => {
            let elementWidth = element.getElementWidth();
            totalwidth += elementWidth;
            elementWidths[element.resizeid] = element.getElementWidth();
        });

        for (let listfield of this.listfields) {
            listfield.width = Math.round((elementWidths[listfield.id] / totalwidth) * 100);
        }
    }
}
