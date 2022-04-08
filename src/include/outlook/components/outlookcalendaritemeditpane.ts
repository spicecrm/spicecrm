/**
 * @module Outlook
 */

import {Component} from "@angular/core";

import {GroupwareService} from '../../../include/groupware/services/groupware.service';

@Component({
    templateUrl: '../templates/outlookcalendaritemeditpane.html'
})
export class OutlookCalendarItemEditPane {

    /**
     * the outlook calendar item id
     */
    public calendaritemid: string;

    /**
     * the module this is linked to
     */
    public module: string;

    /**
     * the id this is linked to
     */
    public id: string;

    /**
     * the custom properties object
     */
    public customProperties: any;

    constructor(
        public groupware: GroupwareService,
    ) {
        this.groupware.getCalenderItemId().subscribe(id => {
            this.calendaritemid = id;
        });

        /*
        this.groupware.getAccessToken().subscribe(token => {
            console.log(token);
        })
        */

        this.groupware.getCustomProperties().subscribe(props => {

            this.module = props.get('_module');
            this.id = props.get('_id');

            this.customProperties = props;

            // this.module = 'Meetings';
            // this.id = '105b119a-81c6-f039-e6c0-57bc0c7540e9';
        });
    }

}
