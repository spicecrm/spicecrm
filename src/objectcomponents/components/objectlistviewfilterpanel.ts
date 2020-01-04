/**
 * @module ObjectComponents
 */
import {
    Component,
    ElementRef, Renderer2
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {listfilters} from '../services/listfilters.service';
import {animate, style, transition, trigger} from "@angular/animations";

declare var _: any;

/**
 * renders the filter panel for the list view
 */
@Component({
    selector: 'object-listview-filter-panel',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanel.html',
    providers: [listfilters]
})
export class ObjectListViewFilterPanel {

    /**
     * the default filter object
     */
    private filter = {
        logicaloperator: 'and',
        groupscope: 'all',
        geography: {},
        conditions: []
    };

    constructor(private elementRef: ElementRef, private listfilters: listfilters, private language: language, private metadata: metadata, private modellist: modellist, private model: model, private renderer: Renderer2) {
        // subscribe to the list type selected to handle the filters set by the listtype
        this.modellist.listtype$.subscribe(newList => {
            this.setFilter();
        });
    }

    /**
     * resets the filter data when the list is changed
     */
    private setFilter() {
        // create a shallow copy of the filter and use locally
        this.filter = {...this.modellist.getFilterDefs()};

        // if no filter is set ... set it clean and empty
        if (!this.filter || _.isEmpty(this.filter)) {
            this.filter = {
                logicaloperator: 'and',
                groupscope: 'all',
                geography: {},
                conditions: []
            };
        }
    }

    /**
     * simple getter and setter for the geography
     */
    get geography() {
        return this.filter.geography ? this.filter.geography : {};
    }

    /**
     * simple setter for the geography
     *
     * @param geography
     */
    set geography(geography) {
        this.filter.geography = geography;
    }

    /**
     * checks if the filter objects has been changed
     */
    get isChanged() {
        return !_.isEqual(this.filter, this.modellist.getFilterDefs());
    }

    /**
     * checks if the user is allowed to edit
     */
    get canEdit() {
        return this.modellist.checkAccess('edit');
    }

    /**
     * saves the filter
     */
    private save() {
        if (this.isChanged) {
            this.modellist.updateListType({
                filterdefs: JSON.stringify(this.filter)
            }, true);

            // close the filter panel
            this.modellist.displayFilters = false;
        }
    }

    /**
     * cancels the edit and resets the filöter to the current defined one
     */
    private cancel() {
        this.filter = {...this.modellist.getFilterDefs()};

        // close the filter panel
        this.modellist.displayFilters = false;
    }

    /**
     * remove all Filters
     */
    private removeAllFilters() {
        this.filter.conditions = [];
    }

    /**
     * adds a new filter expression
     */
    private addExpression(e) {
        e.preventDefault();
        e.stopPropagation();
        let expression = {
            field: '',
            operator: '',
            filtervalue: ''
        };
        this.filter.conditions.push(expression);
    }

    /**
     * delete a filter item
     *
     * @param index index of the filter item
     */
    private deleteItem(index) {
        this.filter.conditions.splice(index, 1);
    }

}
