/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {fts} from '../../../services/fts.service';
import {recent} from '../../../services/recent.service';
import {calendar} from '../services/calendar.service';

/**
 * @ignore
 */
declare var _: any;

/**
 * Display a list of other calendars, other users and an input field to add a user calendar.
 */
@Component({
    selector: 'calendar-other-calendars-monitor',
    templateUrl: './src/modules/calendar/templates/calendarothercalendarsmonitor.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarOtherCalendarsMonitor {
    /**
     * holds the other user calendars
     */
    @Input() private usersCalendars: any[] = [];
    /**
     * emit a boolean to show/hide google events
     */
    @Output() public googleIsVisible$: EventEmitter<any> = new EventEmitter<any>();
    /**
     * holds the search term of user search
     */
    public searchterm: string = '';
    /**
     * boolean to show/hide the user search results
     */
    public searchopen: boolean = false;
    /**
     * holds the user search results
     */
    public resultsList: any[] = [];
    /**
     * holds a list of the recently visited users
     */
    public recentUsers: any[] = [];
    /**
     * holds the search typing timeout
     */
    public timeout: any = undefined;
    /**
     * is true while searching for users
     */
    public isLoading: boolean = false;
    /**
     * holds the hovered item id
     */
    public hovered: string = '';
    /**
     * reference for the input container
     */
    @ViewChild('inputcontainer', {read: ViewContainerRef, static: true}) private inputContainer: ViewContainerRef;
    /**
     * holds the google is visible boolean
     */
    private googleIsVisible: boolean = true;

    constructor(private language: language,
                private recent: recent,
                private calendar: calendar,
                private fts: fts) {
        this.getRecent();
    }

    /**
     * @return boolean true if search box is open
     */
    get searchOpen() {
        return this.searchopen;
    }

    /**
     * set the search open boolean and get recents
     * @param value
     */
    set searchOpen(value) {
        this.searchopen = value;
        if (value) {
            this.getRecent();
        }
    }

    /**
     * @return loookup menu style
     */
    get lookupMenuStyle() {
        return {
            display: this.searchOpen ? 'block' : 'none',
            width: this.inputContainer.element.nativeElement.getBoundingClientRect().width + 'px',
        };
    }

    /**
     * @return search term
     */
    get searchTerm() {
        return this.searchterm;
    }

    /**
     * set the search term and search the users module by term
     * @param value
     */
    set searchTerm(value) {

        window.clearTimeout(this.timeout);
        if (!value || value.length == 0) return;

        this.timeout = window.setTimeout(() => {
            this.searchterm = value;
            this.isLoading = true;
            this.fts.searchByModules({searchterm: this.searchterm, modules: ['Users'], size: 5, sortparams: {sortfield: 'full_name', sortdirection: 'asc'}})
                .subscribe(res => {
                    this.filterResultsList(res.Users.hits.map(user => user = user._source));
                    this.isLoading = false;
                }, err => this.isLoading = false);
        }, 500);
    }

    /**
     * get recently viewed users
     */
    private getRecent() {
        this.recent.getModuleRecent('Users')
            .subscribe(recent => this.filterRecent(recent));
    }

    /**
     * filter recently viewed users
     * @param recent
     */
    private filterRecent(recent) {
        this.recentUsers = recent.filter(user => user.item_id != this.calendar.owner && _.findWhere(this.calendar.usersCalendars, {id: user.item_id}) == undefined);
    }

    /**
     * filter results list from the owner
     * @param resultsList
     */
    private filterResultsList(resultsList) {
        this.resultsList = resultsList.filter(user => user.id != this.calendar.owner && _.findWhere(this.calendar.usersCalendars, {id: user.id}) == undefined);
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    private trackByFn(index, item) {
        return item.id;
    }

    /**
     * add user calendar and filter the added user out of the results
     * @param id
     * @param name
     */
    private addUserCalendar(id, name) {
        this.calendar.addUserCalendar(id, name);
        this.filterRecent(this.recentUsers);
        this.filterResultsList(this.resultsList);
    }

    /**
     * remove user calendar
     * @param id
     */
    private removeUserCalendar(id) {
        this.calendar.removeUserCalendar(id);
    }

    /**
     * show/hide user calendar
     * @param id
     * @param type
     */
    private toggleVisible(id, type) {
        switch (type) {
            case 'Owner':
                this.calendar.toggleOwnerCalendarVisible();
                break;
            case 'Users':
                this.calendar.toggleUserCalendarVisibility(id);
                break;
            case 'Google':
                this.googleIsVisible = !this.googleIsVisible;
                this.googleIsVisible$.emit(this.googleIsVisible);
        }
    }

    /**
     * set user calendar color
     * @param id
     * @param color
     */
    private setUserColor(id, color) {
        this.calendar.setUserColor(id, color);
    }
}
