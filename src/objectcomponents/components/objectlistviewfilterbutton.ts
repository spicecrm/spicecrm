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
import {animate, style, transition, trigger} from "@angular/animations";

declare var _: any;

/**
 * renders the filter panel for the list view
 */
@Component({
    selector: 'object-listview-filter-button',
    templateUrl: '../templates/objectlistviewfilterbutton.html'
})
export class ObjectListViewFilterButton {

    constructor(public modellist: modellist) {

    }

    /**
     * toggles the display attribute on the modellist service
     */
    public togglefilters() {

        // make sure no aggregates are displayed
        this.modellist.displayAggregates = false;

        // toggle the filter display
        this.modellist.displayFilters = !this.modellist.displayFilters;
    }

    /**
     * returns if the filter shoudl be enabled
     */
    get enabled() {
        return this.modellist.filterEnabled();
    }

    /**
     * sets the button to selected when the aggregates are displayed
     */
    get buttonclasses() {
        return this.modellist.displayFilters ? 'slds-is-selected' : '';
    }
}
