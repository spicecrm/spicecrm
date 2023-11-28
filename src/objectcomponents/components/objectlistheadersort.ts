/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

/**
 * renders the header row for a list view table
 */
@Component({
    selector: 'object-list-header-sort',
    templateUrl: '../templates/objectlistheadersort.html'
})
export class ObjectListHeaderSort {
    /**
     * the field we are displaying
     */
    @Input() public field: any;


    constructor(public modellist: modellist) {

    }

    /**
     * a getter to return the module from the modellist service
     */
    get module() {
        return this.modellist.module;
    }

    /**
     * returns if a given fielsd is set sortable in teh fieldconfig
     *
     * @param field the field from the fieldset
     */
    get isSortable(): boolean {
        if (this.field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * a helper function to determine the sort icon based on the set sort criteria
     */
    get sortIcon(): string {
        let sortdata = this.modellist.getSortField(this.field.field);
        if (sortdata) {
            if (sortdata.sortdirection == 'ASC') {
                return 'arrowup';
            } else {
                return 'arrowdown';
            }
        }
        return '';
    }

    get sortindex() {
        let sortdata = this.modellist.getSortField(this.field.field);
        if (sortdata && sortdata.sortitems > 1) {
            return sortdata.sortindex + 1;
        }
        return '';
    }

}
