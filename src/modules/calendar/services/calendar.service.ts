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


/**
 * @ignore
 */
declare var moment: any;

/**
 * @ignore
 */
declare var _: any;

@Injectable()
export class calendar implements OnDestroy {

    public usersCalendars$: EventEmitter<any> = new EventEmitter<any>();
    public addingEvent$: EventEmitter<any> = new EventEmitter<any>();
    public pickerDate$: EventEmitter<any> = new EventEmitter<any>();
    public otherCalendarsColor$: EventEmitter<any> = new EventEmitter<any>();
    public eventDrop$: EventEmitter<any> = new EventEmitter<any>();

    public modules: any[] = [];
    public usersCalendars: any[] = [];
    public otherCalendars: any[] = [];
    public calendardate: any = moment();
    public calendars: any = {};
    public currentStart: any = {};
    public currentEnd: any = {};
    public sidebarwidth: number = 360;
    public sheetTimeWidth: number = 50;
    public sheetHourHeight: number = 80;
    public weekstartday: number = 0;
    public weekDaysCount: number = 7;
    public startHour: number = 0;
    public endHour: number = 23;
    public todayColor: string = '#eb7092';
    public absenceColor: string = '#727272';
    public eventColor: string = '#039be5';
    public googleColor: string = '#db4437';
    public loggedByGoogle: boolean = false;
    public asPicker: boolean = false;
    public isMobileView: boolean = false;
    public isDashlet: boolean = false;
    public isLoading: boolean = false;
    public sheettype: 'Day' | 'Three_Days' | 'Week' | 'Month' | 'Schedule' = 'Week';
    public timeZone: any;
    public duration: any = {
        Day: 'd',
        Three_Days: 'd',
        Week: 'w',
        Month: 'M',
        Schedule: 'M',
    };
    public colorPalette: any[] = [
        'e3abec', 'c2dbf7', '9fd6ff', '9de7da', '9df0c0', 'fff099', 'fed49a',
        'd073e0', '86baf3', '5ebbff', '44d8be', '3be282', 'ffe654', 'ffb758',
        'bd35bd', '5779c1', '5ebbff', '00aea9', '3cba4c', 'f5bc25', 'f99221',
        '580d8c', '001970', '0a2399', '0b7477', '0b6b50', 'b67e11', 'b85d0d',
    ];

    private subscriptions: Subscription = new Subscription();

    constructor(private backend: backend,
                private session: session,
                private broadcast: broadcast,
                private modal: modal,
                private language: language,
                private modelutilities: modelutilities,
                private cdr: ChangeDetectorRef,
                private userPreferences: userpreferences) {
        this.loadCalendarModules();
        this.loadPreferences();
        this.subscribeToLanguage();
        this.getCalendarPreferences();
        this.broadcastSubscriber();
    }

    /**
     * @return sheettype: 'Day' | 'Three_Days' | 'Week' | 'Month' | 'Schedule'
     */
    get sheetType() {
        return this.sheettype;
    }

    /**
     * @param value: 'Day' | 'Three_Days' | 'Week' | 'Month' | 'Schedule'
     * @set sheettype
     * @setSessionData sheetType
     */
    set sheetType(value) {
        this.sheettype = value;
        this.session.setSessionData('sheetType', value);
    }

    /**
     * @return calendardate: moment
     */
    get calendarDate() {
        return this.calendardate;
    }

    /**
     * set the calendar date locally and in the session data
     * @param value: moment
     */
    set calendarDate(value) {
        this.calendardate = new moment(value).locale(this.language.currentlanguage.substring(0, 2));
        this.session.setSessionData('calendarDate', this.calendardate);
    }

    /**
     * @return sidebarWidth: number
     */
    get sidebarWidth() {
        return !this.isMobileView && !this.isDashlet ? this.sidebarwidth : 0;
    }

    /**
     * @return multiEventHeight: number
     */
    get multiEventHeight() {
        return !this.isMobileView ? 25 : 20;
    }

    /**
     * @return ownerId: string
     */
    get owner() {
        return this.session.authData.userId;
    }

    /**
     * @return ownerName: string
     */
    get ownerName() {
        return this.session.authData.userName;
    }

    /**
     * @return weekstartday: number
     */
    get weekStartDay() {
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
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay + (this.weekDaysCount - 1)) {
            this.calendarDate = new moment(this.calendarDate.add(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(this.sheetType == 'Three_Days' ? 3 : 1, this.duration[this.sheetType])));
    }

    /**
    * subtract a duration from calendar date
    */
    public shiftMinus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay) {
            this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(this.sheetType == 'Three_Days' ? 3 : 1, this.duration[this.sheetType])));
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
     * load other users events from backend and manipulate them before return
     * @param startDate: moment
     * @param endDate: moment
     * @return observable of events
     */
    public loadUsersEvents(startDate, endDate) {
        let usersObject = _.object(this.usersCalendars.map(c => c.id), this.usersCalendars);
        return this.loadEvents(startDate, endDate, this.owner, this.usersCalendars.map(c => c.id))
            .pipe(
                map((events: any) => {
                    return events
                        .filter(e => usersObject[e.data.assigned_user_id] && usersObject[e.data.assigned_user_id].visible)
                        .map(event => {
                            event.otherColor = usersObject[event.data.assigned_user_id].color;
                            return event;
                        });
                })
            );
    }

    /**
     * load events from backend and manipulate them before saving them to array
     * @param start: moment
     * @param end: moment
     * @param calendar: object
     * @param users: string[]
     * @return events asObservable
     */
    public loadEvents(start, end, calendar = this.owner, users = []) {
        let userId = users.length > 0 ? 'users' : calendar;
        if (this.doReload(start, end, userId)) {
            this.isLoading = true;
            this.cdr.detectChanges();
            let responseSubject = new Subject<any[]>();
            let format = "YYYY-MM-DD HH:mm:ss";
            let params = {start: start.tz('utc').format(format), end: end.tz('utc').format(format), users};
            let endPoint = users.length > 0 ? 'calendar/users/' : 'calendar/';
            this.currentEnd[userId] = end;
            this.currentStart[userId] = start;

            this.backend.getRequest(endPoint + calendar, params)
                .subscribe(events => {
                    this.calendars[userId] = [];
                    this.isLoading = false;
                    for (let event of events) {
                        if (this.otherCalendars.some(calendar => calendar.name == event.module && !calendar.visible)) continue;

                        switch (event.type) {
                            case 'event':
                                event.start = moment.utc(event.start).tz(this.timeZone);
                                event.end = moment.utc(event.end).tz(this.timeZone);
                                event.isMulti = +event.end.diff(event.start, 'days') > 0;
                                event.color = this.eventColor;
                                break;
                            case 'absence':
                                event.start = moment(event.start).second(1);
                                event.end = moment(event.end).second(1);
                                event.isMulti = true;
                                event.color = this.absenceColor;
                                break;
                            case 'other':
                                event.start = moment(event.start).year(start.year()).second(1);
                                event.end = moment(event.end).year(start.year()).second(1);
                                event.isMulti = true;
                                break;
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
                    responseSubject.next(this.calendars[userId]);
                    responseSubject.complete();
                });
            return responseSubject.asObservable();
        } else {
            let filteredEntries: any[] = [];
            for (let event of this.calendars[userId]) {
                if (this.otherCalendars.some(calendar => calendar.name == event.module && !calendar.visible)) continue;
                if (event.start < end && event.end > start) {
                    event.start = moment(event.start).tz(this.timeZone);
                    event.end = moment(event.end).tz(this.timeZone);
                    filteredEntries.push(event);
                }
            }
            return of(filteredEntries);
        }
    }

    /**
     * load google events from backend and manipulate them before return
     * @param startDate: moment
     * @param endDate: moment
     * @return events asObservable
     */
    public loadGoogleEvents(startDate, endDate) {
        if (!this.loggedByGoogle) {
            return of([]);
        }
        if (this.doReload(startDate, endDate, "google")) {
            this.isLoading = true;
            this.cdr.detectChanges();
            let responseSubject = new Subject<any[]>();
            let format = "YYYY-MM-DD HH:mm:ss";
            let params = {startdate: startDate.format(format), enddate: endDate.format(format)};
            this.calendars.google = [];
            this.currentEnd.google = endDate;
            this.currentStart.google = startDate;

            this.backend.getRequest("google/calendar/getgoogleevents", params)
                .subscribe(res => {
                    if (res.events && res.events.length > 0) {
                        this.isLoading = false;
                        for (let event of res.events) {
                            event.start = moment(event.start.dateTime).format('YYYY-MM-DD HH:mm:ss');
                            event.end = moment(event.end.dateTime).format('YYYY-MM-DD HH:mm:ss');
                            event.start = moment(event.start);
                            event.end = moment(event.end);
                            event.isMulti = +event.end.diff(event.start, 'days') > 0;
                            event.data = {};
                            event.data.summary_text = event.summary;
                            event.data.assigned_user_id = null;
                            event.color = this.googleColor;

                            this.calendars.google.push(event);
                        }
                    }
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

        usersCalendars.push({id: id, name: name, visible: true, color: color});
        this.setUserCalendars(usersCalendars.slice());
    }

    /**
     * remove user calendar from usersCalendars and save the changes
     * @param id: string
     */
    public removeUserCalendar(id) {
        if (this.isMobileView || this.isDashlet) {
            return;
        }
        let usersCalendars = this.usersCalendars.filter(calendar => calendar.id != id);
        this.setUserCalendars(usersCalendars);
    }

    /**
     * save the user calendar changes to the user preferences and emit the changes
     * @param calendars
     * @param save boolean
     */
    public setUserCalendars(calendars, save = true) {
        if (!calendars) {
            return;
        }

        this.usersCalendars = calendars;
        if (save) {
            this.userPreferences.setPreference("Users", this.usersCalendars, true, "Calendar");
        }
        this.usersCalendars$.emit(this.usersCalendars);
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
        events = events.map(event => {
            event.start = moment(event.start).second(0);
            event.end = moment(event.end).second(0);
            return event;
        });
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
     * check if the field has a valid value
     * @param field
     * @return boolean
     */
    protected isValid(field) {
        return field && typeof field === 'object' && field.isValid();
    }

    /**
     * load the modules which have the flag 'show in calendar' in the fts configs
     */
    private loadCalendarModules() {
        this.backend.getRequest('calendar/modules').subscribe(modules => {
            if (modules) this.modules = modules;
        });
    }

    /**
     * check if an absence event exists
     * @param event: object
     * @return boolean
     */
    private absenceExists(event) {
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
    private broadcastSubscriber() {
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
                        if (!this.modifyEvent(id, module, data, uid)) {
                            if (this.isValid(data.date_end) && this.isValid(data.date_start)) {
                                this.calendars[uid].push({
                                    id: id,
                                    module: module,
                                    type: 'event',
                                    start: data.date_start,
                                    end: data.date_end,
                                    isMulti: +data.date_end.diff(data.date_start, 'days') > 0,
                                    data: data
                                });
                                this.triggerSheetReload();
                            }
                        }
                        break;
                    case "model.delete":
                        if (!this.calendars[this.owner]) {
                            return;
                        }
                        this.deleteEvent(id, module);
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
     * @param uid
     * @return boolean
     */
    private modifyEvent(id, module, data, uid) {
        if (!this.isValid(data.date_start) || !this.isValid(data.date_end)) {
            return true;
        }
        if (data.date_start > this.currentEnd && data.date_end < this.currentStart) {
            this.deleteEvent(id, module);
            return true;
        }
        let event = this.calendars[uid].find(thisevent => thisevent.id == id);
        if (event) {
            event.start = data.date_start;
            event.end = data.date_end;
            event.isMulti = +data.date_end.diff(data.date_start, 'days') > 0;
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
    private deleteEvent(id, module) {
        this.calendars[this.owner].some(event => {
            if (event.id == id && module == event.module) {
                this.calendars[this.owner] = this.calendars[this.owner].filter(e => e.id != event.id);
                this.triggerSheetReload();
                return true;
            }
        });
    }

    /**
     * load calendar preferences from user preferences and from the saved session
     */
    private loadPreferences() {
        this.timeZone = this.session.getSessionData('timezone') || moment.tz.guess();
        let preferences = this.userPreferences.toUse;
        this.weekStartDay = preferences.week_day_start == "Monday" ? 1 : 0 || this.weekStartDay;
        this.weekDaysCount = +preferences.week_days_count || this.weekDaysCount;
        this.startHour = +preferences.calendar_day_start_hour || this.startHour;
        this.endHour = +preferences.calendar_day_end_hour || this.endHour;

        let savedCalendarDate = this.session.getSessionData('calendarDate', false);
        let savedSheetType = this.session.getSessionData('sheetType', false);
        if (savedSheetType) this.sheettype = savedSheetType;
        if (savedCalendarDate) this.calendardate = new moment(savedCalendarDate);
        this.triggerSheetReload();
    }

    /**
     * load calendar preferences from the user preferences and save changes in calendar
     */
    private getCalendarPreferences() {
        if (this.isMobileView || this.isDashlet) return;

        this.userPreferences.loadPreferences("Calendar")
            .pipe(take(1))
            .subscribe(calendars => {
                this.setUserCalendars(calendars.Users, false);
                this.setOtherCalendars(calendars.Other, false);
            });
        if (this.session.authData.googleToken) {
            this.loggedByGoogle = true;
        }
    }

    /**
     * subscribe to language change and reload events to apply change
    */
    private subscribeToLanguage() {
        let languageSubscriber = this.language.currentlanguage$.subscribe(() => this.triggerSheetReload());
        this.subscriptions.add(languageSubscriber);
    }

    /**
     * reset the calendar date to force reload the events
     * @param date: moment
     */
    private triggerSheetReload(date?) {
        this.calendarDate = moment(date ? date : this.calendardate);
    }
}
