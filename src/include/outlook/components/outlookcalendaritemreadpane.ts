
/**
 * @module Outlook
 */

import {Component} from "@angular/core";


import {GroupwareService} from "../../../include/groupware/services/groupware.service";

@Component({
    templateUrl: './src/include/outlook/templates/outlookcalendaritemreadpane.html'
})
export class OutlookCalendarItemReadPane {

    /**
     * the outlook calendar item id
     */
    private calendaritemid: string;

    /**
     * the module this is linked to
     */
    private module: string;

    /**
     * the id this is linked to
     */
    private id: string;

    /**
     * the custom properties object
     */
    private customProperties: any;

    constructor(
        private groupware: GroupwareService,
    ) {
        this.groupware.getCalenderItemId().subscribe(id => {
            this.calendaritemid = id;
        });

        this.groupware.getCustomProperties().subscribe(props => {
            this.customProperties = props;

            this.module = this.customProperties.get('_module');
            this.id = this.customProperties.get('_id');

            // this.module = 'Meetings';
            // this.id = '105b119a-81c6-f039-e6c0-57bc0c7540e9';
        });
    }

}
