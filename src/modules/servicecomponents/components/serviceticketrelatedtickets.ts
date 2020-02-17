/**
 * @module ServiceComponentsModule
 */
import {
    Component, ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

/**
 * renders a tab panel with open and closed tickets summary
 */
@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketrelatedtickets.html'
})
export class ServiceTicketRelatedTickets {

    /**
     * defines the current scope opf the tabes shwoing the open or the closed items
     */
    private scope: 'open' | 'closed' = 'open';

    /**
     * the config loaded when the component is rendered
     */
    private componentconfig: any = {};

    /**
     * the count of open tickets, set from teh child component
     */
    private opencount: number = 0;

    /**
     * the count of closed tickets, set from teh child component
     */
    private closedcount: number = 0;

    constructor(private model: model, private metadata: metadata, private language: language) {}

    /**
     * returns the filter for the open tickets
     */
    get filteropen() {
        return this.componentconfig.filteropen;
    }

    /**
     * retusn the filter for the closed tickets
     */
    get filterclosed() {
        return this.componentconfig.filterclosed;
    }

    /**
     * returns the fieldset as set in the config
     */
    get fieldset() {
        return this.componentconfig.fieldset;
    }
}
