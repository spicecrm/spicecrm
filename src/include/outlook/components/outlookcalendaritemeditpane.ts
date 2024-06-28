/**
 * @module Outlook
 */

import {AfterViewInit, ChangeDetectorRef, Component} from "@angular/core";

import {GroupwareService} from '../../../include/groupware/services/groupware.service';

@Component({
    selector: 'outlook-calendar-item-edit-pane',
    templateUrl: '../templates/outlookcalendaritemeditpane.html'
})
export class OutlookCalendarItemEditPane implements AfterViewInit {

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
        private cdRef: ChangeDetectorRef,
    ) {
    }

    public ngAfterViewInit() {
        this.groupware.getCalenderItemId().subscribe(id => {
            this.calendaritemid = id;
        });

        this.groupware.getCustomProperties().subscribe(props => {

            this.module = props.get('_module');
            this.id = props.get('_id');

            this.customProperties = props;
            this.cdRef.detectChanges();
        });
    }

}
