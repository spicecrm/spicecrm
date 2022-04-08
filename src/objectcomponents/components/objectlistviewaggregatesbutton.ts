/**
 * @module ObjectComponents
 */
import {
    Component, ElementRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {model} from '../../services/model.service';

/**
 * renders a button that toggles the aggergates panel on the modellist
 */
@Component({
    selector: 'object-listview-aggregates-button',
    templateUrl: '../templates/objectlistviewaggregatesbutton.html'
})
export class ObjectListViewAggregatesButton {

    constructor(
        public modellist: modellist
    ) {

    }

    /**
     * toggles the display attribute on the modellist service
     */
    public toggleaggregates() {
        // make sure no filters are displayed
        this.modellist.displayFilters = false;

        // toggle aggregates display
        this.modellist.displayAggregates = !this.modellist.displayAggregates;
    }

    get enabled() {
        return this.modellist.aggregatesEnabled() && !this.modellist.isLoading;
    }

    /**
     * sets the button to selected when the aggregates are displayed
     */
    get buttonclasses() {
        return this.modellist.displayAggregates ? 'slds-is-selected' : '';
    }

}
