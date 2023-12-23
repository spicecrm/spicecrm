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
    templateUrl: '../templates/calendarothercalendarsmonitor.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarOtherCalendarsMonitor {
    /**
     * holds the other user calendars
     */
    @Input() public usersCalendars: any[] = [];
    /**
     * emit a boolean to show/hide google events
     */
    @Output() public groupwareVisible$: EventEmitter<any> = new EventEmitter<any>();
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
    @ViewChild('inputcontainer', {read: ViewContainerRef, static: true}) public inputContainer: ViewContainerRef;
    /**
     * holds the google is visible boolean
     */
    public groupwareVisible: boolean = true;

    constructor(public language: language,
                public recent: recent,
                public calendar: calendar,
                public fts: fts) {
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
    public getRecent() {
        this.recent.getModuleRecent('Users')
            .subscribe(recent => this.filterRecent(recent));
    }

    /**
     * filter recently viewed users
     * @param recent
     */
    public filterRecent(recent) {
        this.recentUsers = recent.filter(user => user.item_id != this.calendar.owner && _.findWhere(this.calendar.usersCalendars, {id: user.item_id}) == undefined);
    }

    /**
     * filter results list from the owner
     * @param resultsList
     */
    public filterResultsList(resultsList) {
        this.resultsList = resultsList.filter(user => user.id != this.calendar.owner && _.findWhere(this.calendar.usersCalendars, {id: user.id}) == undefined);
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * add user calendar and filter the added user out of the results
     * @param id
     * @param name
     */
    public addUserCalendar(id, name) {
        this.calendar.addUserCalendar(id, name);
        this.filterRecent(this.recentUsers);
        this.filterResultsList(this.resultsList);
    }

    /**
     * remove user calendar
     * @param id
     */
    public removeUserCalendar(id) {
        this.calendar.removeUserCalendar(id);
    }

    /**
     * show/hide user calendar
     * @param id
     * @param type
     */
    public toggleVisible(id, type) {
        switch (type) {
            case 'Owner':
                this.calendar.toggleOwnerCalendarVisible();
                break;
            case 'Users':
                this.calendar.toggleUserCalendarVisibility(id);
                break;
            case 'Google':
                this.groupwareVisible = !this.groupwareVisible;
                this.groupwareVisible$.emit(this.groupwareVisible);
        }
    }

    /**
     * set user calendar color
     * @param id
     * @param color
     */
    public setUserColor(id, color) {
        this.calendar.setUserColor(id, color);
    }
}
