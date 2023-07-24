/**
 * @module ModuleCalendar
 */
import {ChangeDetectorRef, EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {of, Subject, Subscription} from 'rxjs';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {userpreferences} from "../../../services/userpreferences.service";
import {broadcast} from "../../../services/broadcast.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {map, take} from "rxjs/operators";
import {CdkDragEnd} from "@angular/cdk/drag-drop";
import {configurationService} from "../../../services/configuration.service";
import {metadata} from "../../../services/metadata.service";


/**
 * @ignore
 */
declare var moment: any;

/**
 * @ignore
 */
declare var _: any;

/**
 * Handle loading events from backend, manage other calendars, holds some default necessary values for calendar sheets and subscribe to handle model changes.
 */
@Injectable()
export class calendar implements OnDestroy {
    /**
     * emits when a user calendar is refactored
     */
    public userCalendarChange$ = new EventEmitter<{id: string, name: string, visible: boolean, color: string} | {id: string}>();
    /**
     * holds the search term
     */
    public searchTerm: string = '';
    /**
     *  emit on drop target click
     */
    public addingEvent$ = new EventEmitter<any>();
    /**
     * emit on drop target click when the calendar is being used as picker
     */
    public pickerDate$ = new EventEmitter<any>();
    /**
     * emit when a calendar color changed
     */
    public otherCalendarsColor$ = new EventEmitter<any>();
    /**
     * emit when the layout change e.g. zoom in/out
     */
    public layoutChange$ = new EventEmitter<void>();
    /**
     * holds a list of fts calendar enabled modules
     */
    public modules: any[] = [];
    /**
     * holds the owner calendar visibility
     */
    public ownerCalendarVisible: boolean = true;
    /**
     * holds the other users calendars
     */
    public usersCalendars: {id: string, name: string, visible: boolean, color: string}[] = [];
    /**
     * holds the other calendars
     */
    public otherCalendars: any[] = [];
    /**
     * holds the loaded calendar events
     */
    public calendars: any = {};
    /**
     * holds the current start date
     */
    public currentStart: any = {};
    /**
     * holds the current end date
     */
    public currentEnd: any = {};
    /**
     * holds the sheet time column with
     */
    public sheetTimeWidth: number = 50;
    /**
     * holds the sheet hour height
     */
    public sheetHourHeight: number = 80;
    /**
     * holds the week start day from user preferences
     */
    public weekstartday: number = 0;
    /**
     * holds the week days count
     */
    public weekDaysCount: number = 7;
    /**
     * holds the start hour from user preferences
     */
    public startHour: number = 0;
    /**
     * holds the end hour from user preferences
     */
    public endHour: number = 23;
    /**
     * holds the multi event height
     */
    public multiEventHeight: number = 25;
    /**
     * holds the today text color
     */
    public todayColor: string = '#eb7092';
    /**
     * holds the absence event color
     */
    public absenceColor: string = '#727272';
    /**
     * holds the default event color
     */
    public eventColor: string = '#039be5';
    /**
     * holds the groupware service event color
     */
    public groupwareColor: string = '#db4437';
    /**
     * if the user was logged in by on of the groupware services
     */
    public activeGroupware: 'google' | 'microsoft';
    /**
     * true if the calendar is used as picker
     */
    public asPicker: boolean = false;
    /**
     * true if the view port is small
     */
    public isMobileView: boolean = false;
    /**
     * true if the calendar sheet is used as dashlet
     */
    public isDashlet: boolean = false;
    /**
     * id of the user to be user as owner of the calendar. Used in dashlet
     */
    public customOwner: string;
    /**
     * true while loading the events from backend
     */
    public isLoading: boolean = false;
    /**
     * ture if the user preferences are loaded
     */
    public userPreferencesLoaded: boolean = false;
    /**
     * holds the system timezone which is loaded from the session
     */
    public timeZone: any;
    /**
     * duration mapping object for moment js
     */
    public duration: any = {
        Day: 'd',
        Three_Days: 'd',
        Week: 'w',
        Month: 'M',
        Schedule: 'M',
    };
    /**
     * color palette for the other calendars
     */
    public colorPalette: any[] = [
        'e3abec', 'c2dbf7', '9fd6ff', '9de7da', '9df0c0', 'fff099', 'fed49a',
        'd073e0', '86baf3', '5ebbff', '44d8be', '3be282', 'ffe654', 'ffb758',
        'bd35bd', '5779c1', '5ebbff', '00aea9', '3cba4c', 'f5bc25', 'f99221',
        '580d8c', '001970', '0a2399', '0b7477', '0b6b50', 'b67e11', 'b85d0d',
    ];
    /**
     * holds the subscriptions to unsubscribe on destroy
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public backend: backend,
                public session: session,
                public broadcast: broadcast,
                public modal: modal,
                public language: language,
                public configuration: configurationService,
                public modelutilities: modelutilities,
                public metadata: metadata,
                public cdRef: ChangeDetectorRef,
                public userPreferences: userpreferences) {
        this.loadCalendarModules();
        this.loadPreferences();
        this.subscribeToLanguage();
        this.getCalendarPreferences();
        this.broadcastSubscriber();
    }

    /**
     * holds the sidebar width
     */
    public _sidebarWidth: number = 360;

    /**
     * @return sidebar width
     */
    get sidebarWidth(): number {
        return !this.isMobileView && !this.isDashlet ? this._sidebarWidth : 0;
    }

    /**
     * holds the calendar date
     */
    public _calendarDate: any = moment();

    /**
     * @return calendardate: moment
     */
    get calendarDate() {
        return this._calendarDate;
    }

    /**
     * set the calendar date locally and in the session data
     * @param value: moment
     */
    set calendarDate(value) {
        this._calendarDate = new moment(value).locale(this.language.currentlanguage.substring(0, 2));
        this.session.setSessionData('calendarDate', this._calendarDate);
    }

    /**
     * holds the current sheet type
     */
    public _sheetType: 'Day' | 'Three_Days' | 'Week' | 'Month' | 'Schedule' = 'Week';

    /**
     * @return current sheet type
     */
    get sheetType() {
        return this._sheetType;
    }

    /**
     * set the sheet type
     * save the current sheet type to the session
     * @param value
     */
    set sheetType(value) {
        this._sheetType = value;
        this.session.setSessionData('sheetType', value);
    }

    /**
     * @return owner id
     */
    get owner(): string {
        return this.customOwner ?? this.session.authData.userId;
    }

    /**
     * @return owner name
     */
    get ownerName(): string {
        return this.session.authData.userName;
    }

    /**
     * @return weekstartday: number
     */
    get weekStartDay(): number {
        return this.weekstartday;
    }

    /**
     * @param value: number
     * @set weekstartday
     */
    set weekStartDay(value) {
        this.weekstartday = value;
    }

    /**
     * reset the current date and reset the calendar date to ensure reloading the events
     * @param date?: moment
     */
    public refresh(date?) {
        this.currentStart = {};
        this.currentEnd = {};
        this.triggerSheetReload(date);
    }

    /**
     * add a duration to calendar date
     */
    public shiftPlus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this._calendarDate.day() == this.weekStartDay + (this.weekDaysCount - 1)) {
            this._calendarDate = new moment(this._calendarDate.add(moment.duration(weekDaysCountOffset, "d")));
        }
        this._calendarDate = new moment(this._calendarDate.add(moment.duration(this.sheetType == 'Three_Days' ? 3 : 1, this.duration[this.sheetType])));
    }

    /**
     * subtract a duration from calendar date
     */
    public shiftMinus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this._calendarDate.day() == this.weekStartDay) {
            this._calendarDate = new moment(this._calendarDate.subtract(moment.duration(weekDaysCountOffset, "d")));
        }
        this._calendarDate = new moment(this._calendarDate.subtract(moment.duration(this.sheetType == 'Three_Days' ? 3 : 1, this.duration[this.sheetType])));
    }

    /**
     * check if reload is necessary
     * @param start: moment
     * @param end: moment
     * @param calendar: object
     * @return boolean
     */
    public doReload(start, end, calendar) {
        let noRecords = !this.calendars[calendar] || (this.calendars[calendar] && this.calendars[calendar].length == 0);
        let dateChanged = !this.currentStart[calendar] || !this.currentEnd[calendar] || !this.currentStart[calendar].isSame(start) || !this.currentEnd[calendar].isSame(end);
        return noRecords || dateChanged;
    }

    /**
     * load other user events from backend and manipulate them before return
     * @param startDate: moment
     * @param endDate: moment
     * @param userId: string
     * @return observable of events
     */
    public loadUserEvents(startDate, endDate, userId) {

        return this.loadEvents(startDate, endDate, this.owner, [userId], true)
            .pipe(
                map(events => {
                    return events.map(event => {
                        event.id = userId + event.id;
                        event.otherColor = this.usersCalendars.find(calendar => calendar.id == userId).color;
                        return event;
                    });
                })
            );
    }

    /**
     * load other users events from backend and manipulate them before return
     * @param startDate: moment
     * @param endDate: moment
     * @return observable of events
     */
    public loadUsersEvents(startDate, endDate) {
        const visibleUserCalendars = this.usersCalendars.filter(c => !!c.visible);
        const visibleUserIds = visibleUserCalendars.map(c => c.id);
        const calendarsObject = _.object(visibleUserIds, visibleUserCalendars);
        if (visibleUserCalendars.length == 0) {
            return of([]);
        }
        return this.loadEvents(startDate, endDate, this.owner, visibleUserIds)
            .pipe(
                map(events => {
                    const resEvents = [];

                    events.forEach(event => {

                        // check if user assigned
                        if (!!calendarsObject[event.data.assigned_user_id]) {
                            event.otherColor = calendarsObject[event.data.assigned_user_id].color;
                            resEvents.push(event);

                            // check if user is participant
                        } else if (!!event.data.meeting_user_status_accept) {
                            const userId = visibleUserIds.find(userId => !!event.data.meeting_user_status_accept.beans[userId]);
                            if (!userId) return;
                            event.id = userId + event.id;
                            event.otherColor = calendarsObject[userId].color;
                            resEvents.push(event);
                        }
                    });
                    return resEvents;
                })
            );
    }

    /**
     * load events from backend and manipulate them before saving them to array
     * @param start: moment
     * @param end: moment
     * @param calendar: object
     * @param users: string[]
     * @param forceReload: boolean
     * @return events asObservable
     */
    public loadEvents(start, end, calendar = this.owner, users = [], forceReload?) {
        let userId = users.length > 0 ? 'users' : calendar;
        if (forceReload || this.doReload(start, end, userId)) {
            this.isLoading = true;
            this.cdRef.detectChanges();
            let responseSubject = new Subject<any[]>();
            let format = "YYYY-MM-DD HH:mm:ss";
            let params = {start: start.tz('utc').format(format), end: end.tz('utc').format(format), users, searchTerm: this.searchTerm};
            let endPoint = users.length > 0 ? 'module/Calendar/users/' : 'module/Calendar/';
            this.currentEnd[userId] = end;
            this.currentStart[userId] = start;

            this.backend.getRequest(endPoint + calendar, params)
                .subscribe(events => {
                    this.calendars[userId] = [];

                    for (let event of events) {

                        if ((userId == this.owner && !!event.data.external_id && !!this.calendars.google && this.calendars.google.some(e => e.id == event.data.external_id)) ||
                            this.otherCalendars.some(calendar => calendar.name == event.module && !calendar.visible)) {
                            continue;
                        }

                        switch (event.type) {
                            case 'event':
                                event.start = moment.utc(event.start).tz(this.timeZone).second(0);
                                event.end = moment.utc(event.end).tz(this.timeZone).second(0);
                                event.isMulti = +event.end.diff(event.start, 'days', true) >= 1;
                                event.color = this.eventColor;
                                break;
                            case 'absence':
                                event.start = moment(event.start).second(0);
                                event.end = moment(event.end).second(0);
                                event.isMulti = true;
                                event.isAllDay = true;
                                event.color = this.absenceColor;
                                break;
                            case 'other':
                                event.start = moment(event.start).year(start.year()).second(0);
                                event.end = moment(event.end).year(start.year()).second(0);
                                event.isMulti = true;
                                break;
                        }

                        const inRange = event.start.date() != event.end.date() || ((event.start.hour() >= this.startHour && event.start.hour() <= this.endHour) || (event.end.hour() >= this.startHour && event.end.hour() <= this.endHour));

                        if (['Day', 'Three_Days', 'Week'].some(t => t == this.sheetType) && !inRange) {
                            continue;
                        }

                        if (event.module == 'UserAbsences') {
                            if (event.type == 'other') {
                                event.data.summary_text = event.data.user_name;
                                event.id = event.id + "-other";
                                event.data.id = event.data.id + "-other";
                            }
                            if (this.absenceExists(event)) {
                                continue;
                            }
                        }

                        this.calendars[userId].push(event);
                    }
                    this.isLoading = false;
                    this.cdRef.detectChanges();

                    responseSubject.next(this.calendars[userId]);
                    responseSubject.complete();
                });
            return responseSubject.asObservable();
        } else {
            let filteredEntries: any[] = [];
            for (let event of this.calendars[userId]) {
                if (this.otherCalendars.some(calendar => calendar.name == event.module && !calendar.visible)) continue;
                if (event.start < end && event.end > start) {
                    event.start = moment(event.start).tz(this.timeZone).second(0);
                    event.end = moment(event.end).tz(this.timeZone).second(0);
                    filteredEntries.push(event);
                }
            }
            return of(filteredEntries);
        }
    }

    /**
     * load events for the active groupware service
     * @param startDate
     * @param endDate
     */
    public loadGroupwareEvents(startDate: string, endDate: string) {
        switch (this.activeGroupware) {
            case 'google':
                return this.loadGoogleEvents(startDate, endDate);
            case 'microsoft':
                return this.loadMicrosoftEvents(startDate, endDate);
            default:
                return of([]);
        }
    }

    /**
     * load google events from backend and manipulate them before return
     * @param startDate: moment
     * @param endDate: moment
     * @return events asObservable
     */
    public loadGoogleEvents(startDate, endDate) {

        if (this.doReload(startDate, endDate, "google")) {
            this.isLoading = true;
            this.cdRef.detectChanges();
            let responseSubject = new Subject<any[]>();
            let format = "YYYY-MM-DD HH:mm:ss";
            let params = {startdate: startDate.format(format), enddate: endDate.format(format), searchTerm: this.searchTerm};
            this.calendars.google = [];
            this.currentEnd.google = endDate;
            this.currentStart.google = startDate;

            this.backend.getRequest("channels/groupware/gsuite/calendar/events", params)
                .subscribe(res => {
                    if (res.events && res.events.length > 0) {
                        for (let event of res.events) {
                            if (!!this.calendars[this.owner] && this.calendars[this.owner].some(e => e.data.external_id == event.id)) continue;

                            event.start = moment(moment(event.start.dateTime ?? event.start.date)
                                .format(!event.start.dateTime && !!event.start.date ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:00'));
                            event.end = moment(moment(event.end.dateTime ?? event.end.date)
                                .format(!event.end.dateTime && !!event.end.date ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:00'));

                            event.isMulti = +event.end.diff(event.start, 'days', true) >= 1;
                            event.color = this.groupwareColor;
                            event.type = 'google';

                            this.calendars.google.push(event);
                        }
                    }
                    this.isLoading = false;
                    this.cdRef.detectChanges();
                    responseSubject.next(this.calendars.google);
                    responseSubject.complete();
                });
            return responseSubject.asObservable();
        } else {
            let filteredEntries = [];
            for (let event of this.calendars.google) {
                if (event.start < endDate && event.end > startDate) {
                    filteredEntries.push(event);
                }
            }
            return of(filteredEntries);
        }
    }

    /**
     * load microsoft events from backend and manipulate them before return
     * @param startDate: moment
     * @param endDate: moment
     * @return events asObservable
     */
    public loadMicrosoftEvents(startDate, endDate) {

        if (this.doReload(startDate, endDate, "microsoft")) {
            this.isLoading = true;
            this.cdRef.detectChanges();
            let responseSubject = new Subject<any[]>();
            let format = "YYYY-MM-DD HH:mm:ss";
            let params = {startdate: startDate.format(format), enddate: endDate.format(format), searchTerm: this.searchTerm};
            this.calendars.microsoft = [];
            this.currentEnd.microsoft = endDate;
            this.currentStart.microsoft = startDate;

            this.backend.getRequest(`channels/groupware/microsoft/calendar/events/${this.owner}`, params)
                .subscribe(res => {
                    if (res.events && res.events.length > 0) {
                        for (let event of res.events) {
                            if (!!this.calendars[this.owner] && this.calendars[this.owner].some(e => e.data.external_id == event.id)) continue;

                            event.start = moment(moment.utc(event.start.dateTime).tz(this.timeZone).format('YYYY-MM-DD HH:mm:00'));
                            event.end = moment(moment.utc(event.end.dateTime).tz(this.timeZone).format('YYYY-MM-DD HH:mm:00'));

                            event.isMulti = +event.end.diff(event.start, 'days', true) >= 1;
                            event.color = this.groupwareColor;
                            event.type = 'microsoft';

                            this.calendars.microsoft.push(event);
                        }
                    }
                    this.isLoading = false;
                    this.cdRef.detectChanges();
                    responseSubject.next(this.calendars.microsoft);
                    responseSubject.complete();
                });
            return responseSubject.asObservable();
        } else {
            let filteredEntries = [];
            for (let event of this.calendars.microsoft) {
                if (event.start < endDate && event.end > startDate) {
                    filteredEntries.push(event);
                }
            }
            return of(filteredEntries);
        }
    }

    /**
     * get events for a specific calendar id
     * @param calendar id
     * @return events
     */
    public getEvents(calendar = this.owner) {
        return this.calendars[calendar] ? this.calendars[calendar] : [];
    }

    /**
     * save the other calendar changes to the user preferences and reload to apply the change
     * @param calendars: object[]
     * @param save: boolean
     * @param save: boolean
     */
    public setOtherCalendars(calendars, save = true) {
        if (!calendars) {
            return;
        }

        this.otherCalendars = calendars;
        if (save) {
            this.userPreferences.setPreference("Other", this.otherCalendars, true, "Calendar");
            this.triggerSheetReload();
        }
    }

    /**
     * add new user calendar to userCalendars and save the changes
     * @param id: string
     * @param name: string
     */
    public addUserCalendar(id, name) {
        if (this.isMobileView || this.isDashlet) {
            return;
        }
        let usersCalendars = this.usersCalendars;
        let color = '#' + this.colorPalette[Math.floor(this.colorPalette.length * Math.random())];
        const newCalendar: {id: string, name: string, visible: boolean, color: string} = {
            id: id,
            name: name,
            visible: true,
            color: color
        };
        usersCalendars.push(newCalendar);
        this.userCalendarChange$.emit(newCalendar);
        this.setUserCalendars(usersCalendars.slice());
    }

    /**
     * find the calendar to be removed and emit the calendar with visible false to reload the calendar events
     * remove user calendar from usersCalendars and save the changes
     * @param id: string
     */
    public removeUserCalendar(id) {
        if (this.isMobileView || this.isDashlet) {
            return;
        }
        const calendar = this.usersCalendars.find(calendar => calendar.id == id);
        calendar.visible = false;
        this.userCalendarChange$.emit(calendar);

        let usersCalendars = this.usersCalendars.filter(calendar => calendar.id != id);
        this.setUserCalendars(usersCalendars);
    }

    /**
     * toggle user calendar visibility
     * @param id
     */
    public toggleUserCalendarVisibility(id) {
        this.usersCalendars.some(calendar => {
            if (calendar.id == id) {
                calendar.visible = !calendar.visible;
                this.userCalendarChange$.emit(calendar);
                this.setUserCalendars(this.usersCalendars.slice());
                return true;
            }
        });
    }

    /**
     * save the owner calendar visibility to the user preferences and emit the changes
     */
    public toggleOwnerCalendarVisible() {
        this.ownerCalendarVisible = !this.ownerCalendarVisible;
        this.userCalendarChange$.emit({id: 'owner'});
        this.userPreferences.setPreference("ownerVisible", this.ownerCalendarVisible, true, "Calendar");
    }

    /**
     * save the user calendar changes to the user preferences and emit the changes
     * @param calendars
     * @param save boolean
     */
    public setUserCalendars(calendars, save = true) {
        if (!calendars) return;
        this.usersCalendars = calendars;

        if (save) {
            this.userPreferences.setPreference("Users", this.usersCalendars, true, "Calendar");
        }
    }

    /**
     * set user color and save the changes then emit them
     * @param id: string
     * @param color: string<hex>
     */
    public setUserColor(id, color) {
        this.usersCalendars.some(calendar => {
            if (calendar.id == id) {
                calendar.color = color;
                this.setUserCalendars(this.usersCalendars);
                this.otherCalendarsColor$.emit({id: id, color: color});
                return true;
            }
        });
    }

    /**
     * arrange the events equally in the column
     * adding diaplyindex and overly count to each event
     * @param events
     * @return events
     */
    public arrangeEvents(events) {

        // sort the events
        events.sort((a, b) => {
            if (a.start < b.start) {
                return -1;
            }
            if (a.start === b.start) {
                return a.end > b.end ? -1 : 1;
            }
            return 1;
        });
        // assess overlaps
        let calendarOverlay = {};
        for (let _event of events) {
            let elementsOverlaid = [];
            for (let _ovEvent of events) {
                // only the ones we did not handle yet
                // if we have an overlay ... add it
                if (_event.id !== _ovEvent.id && _ovEvent.start < _event.end && _ovEvent.end > _event.start) {
                    elementsOverlaid.push({
                        id: _ovEvent.id,
                        start: _ovEvent.start,
                        end: _ovEvent.end
                    });
                }
            }

            // determine the max number in parallel per event
            let _maxOverlay = 0;
            if (elementsOverlaid.length > 0) {
                // angular.forEach(elementsOverlaid, function (_element) {
                for (let _element of elementsOverlaid) {
                    let _elementOverlayCount = 0;
                    // angular.forEach(elementsOverlaid, function (_ovElement) {
                    for (let _ovElement of elementsOverlaid) {
                        if (_ovElement.start < _element.end && _ovElement.end > _element.start) {
                            _elementOverlayCount++;
                        }
                    }
                    if (_elementOverlayCount > _maxOverlay) {
                        _maxOverlay = _elementOverlayCount;
                    }
                }
                _maxOverlay++;
            }

            calendarOverlay[_event.id] = {
                maxOverlay: _maxOverlay,
                elementsOverlaid: elementsOverlaid
            };
        }

        // determine the display index for all elements
        let handledEvents = [];
        for (let _event of events) {
            let _displayIndex = 0;
            let _usedIndexes = [];
            for (let _ovEvent of events) {
                if (handledEvents.indexOf(_ovEvent.id) !== -1 && _ovEvent.start < _event.end && _ovEvent.end > _event.start) {
                    if (_usedIndexes.indexOf(calendarOverlay[_ovEvent.id].displayIndex) === -1) {
                        _usedIndexes.push(calendarOverlay[_ovEvent.id].displayIndex);
                    }
                    while (_usedIndexes.indexOf(_displayIndex) !== -1) {
                        _displayIndex++;
                    }
                }
            }
            calendarOverlay[_event.id].displayIndex = _displayIndex;
            handledEvents.push(_event.id);
        }


        // finally prpgate to see if any of the nested overlaid elements has a higher max Overly v alue
        for (let _overlayid in calendarOverlay) {
            // angular.forEach(_overlayData.elementsOverlaid, function (_ovOverlayData) {
            for (let _ooverlay of calendarOverlay[_overlayid].elementsOverlaid) {
                if (calendarOverlay[_overlayid].maxOverlay < calendarOverlay[_ooverlay.id].maxOverlay) {
                    calendarOverlay[_overlayid].maxOverlay = calendarOverlay[_ooverlay.id].maxOverlay;
                }
            }
        }

        for (let _event of events) {
            _event.displayIndex = calendarOverlay[_event.id].displayIndex;
            _event.maxOverlay = calendarOverlay[_event.id].maxOverlay;
        }
        return events;

    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * get the matched dropTarget on the event left top corner and pass the target data to onDrop method in the event component
     * @param dragEvent: CdkDragEnd
     * @param dropTargets: CalendarSheetDropTarget
     */
    public onEventDrop(dragEvent: CdkDragEnd, dropTargets) {
        dropTargets.some(target => {
            const targetRect = target.elementRef.nativeElement.getBoundingClientRect();
            const sourceRect = dragEvent.source.element.nativeElement.getBoundingClientRect();

            if (sourceRect.top >= targetRect.top && sourceRect.top <= targetRect.bottom && sourceRect.left >= targetRect.left && sourceRect.left <= targetRect.right) {
                dragEvent.source.data.onDrop({
                    day: target.day,
                    hour: target.hour,
                    minutes: target.minutes
                });
                return true;
            }
        });
        dragEvent.source.reset();
    }

    /**
     * go to day view and reload
     * @param date
     */
    public gotToDayView(date) {
        this.refresh(date);
        this.sheetType = 'Day';
    }

    /**
     * remove the google event from calendar if it's been deleted
     * @param id: string
     */
    public removeGoogleEvent(id: string) {
        this.calendars.google.some((event, index) => {
            if (event.id == id) {
                this.calendars.google.splice(index, 1);
                this.cdRef.detectChanges();
                return true;
            }
        });
    }

    /**
     * remove the microsoft event from calendar if it's been deleted
     * @param id: string
     */
    public removeMicrosoftEvent(id: string) {
        this.calendars.microsoft.some((event, index) => {
            if (event.id == id) {
                this.calendars.microsoft.splice(index, 1);
                this.refresh();
                return true;
            }
        });
    }

    /**
     * set is mobile view boolean and set the multi event height
     * @param bool
     */
    public setIsMobileView(bool) {
        this.isMobileView = bool;
        this.multiEventHeight = !bool ? 25 : 20;
        this.cdRef.detectChanges();
    }

    /**
     * check if the field has a valid value
     * @param field
     * @return boolean
     */
    public isValid(field): boolean {
        return field && typeof field === 'object' && field.isValid();
    }

    /**
     * load the modules which have the flag 'show in calendar' in the fts configs
     */
    public loadCalendarModules() {
        this.backend.getRequest('module/Calendar/modules').subscribe(modules => {
            if (!modules) return;
            this.modules = modules;
            this.cdRef.detectChanges();
        });
    }

    /**
     * check if an absence event exists
     * @param event: object
     * @return boolean
     */
    public absenceExists(event): boolean {
        let found = false;
        for (let prop in this.calendars) {
            if (this.calendars.hasOwnProperty(prop) && this.calendars[prop].some(cEvent => cEvent.id == event.id && cEvent.type == event.type)) {
                found = true;
                break;
            }
        }
        return !!found;
    }

    /**
     * subscribe to model and timezone changes and apply the changes in the calendar
     */
    public broadcastSubscriber() {
        let subscriber = this.broadcast.message$.subscribe(message => {
            let id = message.messagedata.id;
            let module = message.messagedata.module;
            let data = message.messagedata.data;
            if (message.messagetype == 'timezone.changed') {
                this.timeZone = message.messagedata;
                this.triggerSheetReload();
            }
            if (this.modules.some(thisModule => thisModule.name == module)) {
                switch (message.messagetype) {
                    case "model.save":
                        let uid = data.assigned_user_id;
                        let isOtherUser = this.calendars.users && this.calendars.users.some(user => user.id == uid);
                        if (!this.calendars[uid] && !isOtherUser) {
                            return;
                        }

                        if (isOtherUser) uid = 'users';
                        const isModified = this.modifyEvent(id, module, data, uid);

                        if (!isModified && this.isValid(data.date_end) && this.isValid(data.date_start)) {
                            this.calendars[uid].push({
                                id: id,
                                module: module,
                                type: 'event',
                                start: data.date_start,
                                end: data.date_end,
                                isMulti: +data.date_end.diff(data.date_start, 'days', true) >= 1,
                                data: data
                            });
                        }
                        this.triggerSheetReload();
                        this.cdRef.markForCheck();
                        break;
                    case "model.delete":
                        if (!this.calendars[this.owner]) {
                            return;
                        }
                        this.removeEvent(id, module);
                        break;
                }
            }
        });
        this.subscriptions.add(subscriber);
    }

    /**
     * modify event date after drop
     * @param id
     * @param module
     * @param data
     * @param calendarId
     * @return boolean
     */
    public modifyEvent(id: string, module: string, data, calendarId: string) {
        if (!this.isValid(data.date_start) || !this.isValid(data.date_end)) {
            return true;
        }
        if (data.date_start > this.currentEnd && data.date_end < this.currentStart) {
            this.removeEvent(id, module);
            return true;
        }
        let event = this.calendars[calendarId].find(thisevent => thisevent.data.id == id);
        if (event) {
            event.start = data.date_start;
            event.end = data.date_end;
            event.isMulti = +data.date_end.diff(data.date_start, 'days', true) >= 1;
            return true;
        } else {
            return false;
        }
    }

    /**
     * remove the event from calendar if it's been deleted
     * @param id: string
     * @param module: string
     */
    public removeEvent(id: string, module: string) {
        this.calendars[this.owner].some((event, index) => {
            if (event.data.id == id && module == event.module) {
                this.calendars[this.owner].splice(index, 1);
                this.triggerSheetReload();
                this.cdRef.markForCheck();
                return true;
            }
        });
    }

    /**
     * load calendar preferences from user preferences and from the saved session
     */
    public loadPreferences() {
        this.timeZone = this.session.getSessionData('timezone') || moment.tz.guess();
        let preferences = this.userPreferences.toUse;
        this.weekStartDay = preferences.week_day_start == "Monday" ? 1 : 0 || this.weekStartDay;
        this.weekDaysCount = +preferences.week_days_count || this.weekDaysCount;
        this.startHour = +preferences.calendar_day_start_hour || this.startHour;
        this.endHour = +preferences.calendar_day_end_hour || this.endHour;

        let savedCalendarDate = this.session.getSessionData('calendarDate', false);
        let savedSheetType = this.session.getSessionData('sheetType', false);
        if (savedSheetType) this._sheetType = savedSheetType;
        if (savedCalendarDate) this._calendarDate = new moment(savedCalendarDate);
        this.triggerSheetReload();
    }

    /**
     * load calendar preferences from the user preferences and save changes in calendar
     */
    public getCalendarPreferences() {
        if (this.isMobileView || this.isDashlet) return;

        this.userPreferences.loadPreferences("Calendar")
            .pipe(take(1))
            .subscribe(calendars => {
                this.ownerCalendarVisible = calendars?.hasOwnProperty('ownerVisible') ? calendars?.ownerVisible: true;
                if (calendars) {
                    this.setUserCalendars(calendars.Users, false);
                    this.setOtherCalendars(calendars.Other, false);
                }
                this.userPreferencesLoaded = true;
            });

        const groupwareDisabled = this.metadata.getComponentConfig('Calendar').groupwareDisabled;

        if (!groupwareDisabled && (this.session.authData.googleToken || (this.configuration.checkCapability('google_oauth') && this.configuration.getCapabilityConfig('google_oauth').serviceaccess))) {
            this.activeGroupware = 'google';
        }

        if (!groupwareDisabled && this.configuration.getCapabilityConfig('msgraphconfig').isActive) {
            this.activeGroupware = 'microsoft';
        }
    }

    /**
     * subscribe to language change and reload events to apply change
     */
    public subscribeToLanguage() {
        let languageSubscriber = this.language.currentlanguage$.subscribe(() => this.triggerSheetReload());
        this.subscriptions.add(languageSubscriber);
    }

    /**
     * reset the calendar date to force reload the events
     * @param date: moment
     */
    public triggerSheetReload(date?) {
        this._calendarDate = moment(date ? date : this._calendarDate);
    }


    /*
     * will return the full translation for a week day according to current language
     * @param dayIndex: number
     * @return weekdayLong: string
     */
    public weekdayLong(dayIndex) {
        let lang = this.language.currentlanguage.substring(0, 2);
        moment.locale(lang);
        return moment.weekdays(dayIndex);
    }


    /*
     * will return the short translation for a week day according to current language
     * @param dayIndex: number
     * @return weekdayLong: string
     */
    public weekdayShort(dayIndex) {
        let lang = this.language.currentlanguage.substring(0, 2);
        moment.locale(lang);
        return moment.weekdaysShort(dayIndex);
    }

    /*
     * will return the short translation for a month according to current language
     * @param dayIndex: number
     * @return weekdayLong: string
     */
    public monthShort(monthIndex) {
        let lang = this.language.currentlanguage.substring(0, 2);
        moment.locale(lang);
        return moment.monthsShort('-MMM-', monthIndex);
    }
}
