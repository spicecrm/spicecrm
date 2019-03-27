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
    selector: 'object-list-header',
    templateUrl: './src/objectcomponents/templates/objectlistheader.html',
    providers: [view]
})
export class ObjectListHeader {
    /**
     * an array of fields to be displayed passed in from the fieldset and the filter applied
     */
    @Input() private listfields: any[] = [];

    /**
     * an action set ot be applied to the list actions
     */
    @Input() private actionset: string = '';

    constructor(private modellist: modellist, private language: language, private view: view) {

        this.view.labels = 'short';
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

    /**
     * a helper function to determine the sort icon based on the set sort criteria
     */
    private getSortIcon(): string {
        if (this.modellist.sortdirection === 'ASC') {
            return 'arrowdown';
        } else {
            return 'arrowup';
        }
    }

}