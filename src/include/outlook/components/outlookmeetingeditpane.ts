/**
 * @module Outlook
 */

import {Component} from "@angular/core";

import {GroupwareService} from '../../../include/groupware/services/groupware.service';

@Component({
    templateUrl: './src/include/outlook/templates/outlookmeetingeditpane.html'
})
export class OutlookMeetingEditPane {

    /**
     * the outlook meeting id
     */
    private meetingid: string;

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
            this.meetingid = id;
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
