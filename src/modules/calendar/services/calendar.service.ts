/**
 * @module ModuleCalendar
 */
import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {of, Subject, Subscription} from 'rxjs';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {userpreferences} from "../../../services/userpreferences.service";
import {broadcast} from "../../../services/broadcast.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {take} from "rxjs/operators";


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
    public otherCalendars$: EventEmitter<any> = new EventEmitter<any>();
    public addingEvent$: EventEmitter<any> = new EventEmitter<any>();
    public color$: EventEmitter<any> = new EventEmitter<any>();
    public usersCalendars: any[] = [];
    public otherCalendars: any[] = [];
    public sysUICalendars: any[] = [];
    public calendardate: any = {};
    public calendars: any = {};
    public currentStart: any = {};
    public currentEnd: any = {};
    public sidebarwidth: number = 300;
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
    public isAllToken: boolean = false;
    public isMobileView: boolean = false;
    public isDashlet: boolean = false;
    public sheetType: string = 'Week';
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
                private userPreferences: userpreferences) {
        this.loadPreferences();
        this.subscribeToLanguage();
        this.getOtherCalendars();
        this.broadcastSubscriber();
    }

    get calendarDate() {
        return this.calendardate;
    }

    set calendarDate(value) {
        this.calendardate = new moment(value).locale(this.language.currentlanguage.substring(0, 2));
    }

    get sidebarWidth() {
        return !this.isMobileView && !this.isDashlet ? this.sidebarwidth : 0;
    }

    get multiEventHeight() {
        return !this.isMobileView ? 25 : 20;
    }

    get owner() {
        return this.session.authData.userId;
    }

    get weekStartDay() {
        return this.weekstartday;
    }

    set weekStartDay(value) {
        this.weekstartday = value;
    }

    /*
    * trigger the changes for calendar sheets
    * @return void
    */
    public refresh() {
        this.currentStart = {};
        this.currentEnd = {};
        this.calendarDate = new moment(this.calendarDate);
    }

    /*
    * add a duration to calendar date
    * @return void
    */
    public shiftPlus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay + (this.weekDaysCount - 1)) {
            this.calendarDate = new moment(this.calendarDate.add(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(this.sheetType == 'Three_Days' ? 3 : 1, this.duration[this.sheetType])));
    }

    /*
    * subtract a duration from calendar date
    * @return void
    */
    public shiftMinus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay) {
            this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(this.sheetType == 'Three_Days' ? 3 : 1, this.duration[this.sheetType])));
    }

    /*
    * check if reload is necessary
    * @param start
    * @param end
    * @param calendar
    * @return boolean
    */
    public doReload(start, end, calendar) {
        let noRecords = !this.calendars[calendar] || (this.calendars[calendar] && this.calendars[calendar].length == 0);
        let dateChanged = !this.currentStart[calendar] || !this.currentEnd[calendar] || !this.currentStart[calendar].isSame(start) || !this.currentEnd[calendar].isSame(end);
        return noRecords || dateChanged;
    }

    /*
    * @param start
    * @param end
    * @param calendar
    * @param isOther
    * @return events
    */
    public loadEvents(start, end, calendar = this.owner, isOther = false) {
        if (this.doReload(start, end, calendar)) {
            let responseSubject = new Subject<any[]>();
            let format = "YYYY-MM-DD HH:mm:ss";
            let params = {start: start.format(format), end: end.format(format)};
            let endPoint = !isOther ? 'calendar/' : 'calendar/other/';
            this.currentEnd[calendar] = end;
            this.currentStart[calendar] = start;

            this.backend.getRequest(endPoint + calendar, params)
                .subscribe(events => {
                    this.calendars[calendar] = [];
                    for (let event of events) {
                        event.data = this.modelutilities.backendModel2spice(event.module, event.data);
                        switch (event.type) {
                            case 'event':
                                event.start = moment(event.start).tz(this.timeZone).add(moment().utcOffset(), 'm');
                                event.end = moment(event.end).tz(this.timeZone).add(moment().utcOffset(), 'm');
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
                        this.calendars[calendar].push(event);
                    }
                    responseSubject.next(this.calendars[calendar]);
                    responseSubject.complete();
                });
            return responseSubject.asObservable();
        } else {
            let filteredEntries: any[] = [];
            for (let event of this.calendars[calendar]) {
                if (event.start < end && event.end > start) {
                    event.start = moment(event.start).tz(this.timeZone);
                    event.end = moment(event.end).tz(this.timeZone);
                    filteredEntries.push(event);
                }
            }
            return of(filteredEntries);
        }
    }

    /*
    * @param startDate
    * @param endDate
    * @return google events
    */
    public loadGoogleEvents(startDate, endDate) {
        if (!this.loggedByGoogle) {
            return of([]);
        }
        if (this.doReload(startDate, endDate, "google")) {
            let responseSubject = new Subject<any[]>();
            let format = "YYYY-MM-DD HH:mm:ss";
            let params = {startdate: startDate.format(format), enddate: endDate.format(format)};
            this.calendars.google = [];
            this.currentEnd.google = endDate;
            this.currentStart.google = startDate;

            this.backend.getRequest("google/calendar/getgoogleevents", params)
                .subscribe(res => {
                    if (res.events && res.events.length > 0) {
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

    /*
    * get events for a specific calendar id
    * @param calendar id
    * @return events
    */
    public getEvents(calendar = this.owner) {
        return this.calendars[calendar] ? this.calendars[calendar] : [];
    }

    /*
    * open add modal for other calendars
    * @return events
    */
    public addOtherCalendar() {
        if (this.isAllToken || this.isMobileView || this.isDashlet) {
            return;
        }
        let calendars = this.sysUICalendars.filter(calendar => !this.otherCalendars.some(token => token.id == calendar.id));

        this.modal.openModal('CalendarAddCalendar')
            .subscribe(modalRef => {
                modalRef.instance.calendars = calendars;
                modalRef.instance.addCalendar
                    .pipe(take(1))
                    .subscribe(calendar => {
                        if (calendar !== false) {
                            let otherCalendars = this.otherCalendars;
                            otherCalendars.push({
                                id: calendar.id,
                                name: calendar.name,
                                visible: true,
                                color: this.getRandomColor()
                            });
                            this.setOtherCalendars(otherCalendars.slice());
                        }
                    });
            });
    }

    /*
    * @param calendar id
    * @return void
    */
    public removeOtherCalendar(id) {
        if (this.isMobileView || this.isDashlet) {
            return;
        }
        let otherCalendars = this.otherCalendars.filter(calendar => calendar.id != id);
        this.setOtherCalendars(otherCalendars);
    }

    /*
    * @param calendars
    * @param save boolean
    * @return void
    */
    public setOtherCalendars(calendars, save = true) {
        if (!calendars) {
            return;
        }

        this.otherCalendars = calendars;
        if (save) {
            this.userPreferences.setPreference("Other", this.otherCalendars, true, "Calendar");
        }
        this.otherCalendars$.emit(this.otherCalendars);
        this.isAllToken = this.sysUICalendars.length == this.otherCalendars.length;
    }

    /*
    * @param id
    * @param name
    * @return void
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

    /*
    * @param id
    * @return void
    */
    public removeUserCalendar(id) {
        if (this.isMobileView || this.isDashlet) {
            return;
        }
        let usersCalendars = this.usersCalendars.filter(calendar => calendar.id != id);
        this.setUserCalendars(usersCalendars);
    }

    /*
    * @param calendars
    * @param save boolean
    * @return void
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

    /*
    * @param id
    * @param color
    * @param type
    * @return void
    */
    public setColor(id, color, type) {
        switch (type) {
            case "Users":
                this.usersCalendars.some(calendar => {
                    if (calendar.id == id) {
                        calendar.color = color;
                        this.setUserCalendars(this.usersCalendars);
                        return true;
                    }
                });
                break;
            case "Other":
                this.otherCalendars.some(calendar => {
                    if (calendar.id == id) {
                        calendar.color = color;
                        this.setOtherCalendars(this.otherCalendars);
                        return true;
                    }
                });
                break;
        }
        this.color$.emit({id: id, color: color});
    }

    /*
    * internal function to manage the display
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
                if (a.end > b.end) {
                    return -1;
                } else {
                    return 1;
                }
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

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @param event
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

    /*
    * @return color
    */
    private getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /*
    * @return void
    */
    private broadcastSubscriber() {
        let subscriber = this.broadcast.message$.subscribe(message => {
            let id = message.messagedata.id;
            let module = message.messagedata.module;
            let data = message.messagedata.data;
            if (message.messagetype == 'timezone.changed') {
                this.timeZone = message.messagedata;
                this.calendarDate = moment(this.calendarDate);
            }
            if (module == 'Meetings' || module == 'Calls') {
                switch (message.messagetype) {
                    case "model.save":
                        let uid = data.assigned_user_id;
                        if (!this.calendars[uid]) {
                            return;
                        }
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
                                this.calendarDate = moment(this.calendarDate);
                            }
                        }
                        break;
                    case "model.delete":
                        if (!this.calendars[this.owner]) {
                            return;
                        }
                        this.deleteEvent(id, module);
                        this.calendarDate = moment(this.calendarDate);
                        break;
                }
            }
        });
        this.subscriptions.add(subscriber);
    }

    /*
    * modify event after drop
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
        return this.calendars[uid].some(event => {
            if (event.id == id && module == event.module) {
                event.data = data;
                event.start = data.date_start;
                event.end = data.date_end;
                event.isMulti = +data.date_end.diff(data.date_start, 'days') > 0;
                this.calendarDate = moment(this.calendarDate);
                return true;
            }
        });
    }

    /*
    * @param id
    * @param module
    * @return void
    */
    private deleteEvent(id, module) {
        this.calendars[this.owner].some(event => {
            if (event.id == id && module == event.module) {
                this.calendars[this.owner] = this.calendars[this.owner].filter(e => e.id != event.id);
                this.calendarDate = moment(this.calendarDate);
                return true;
            }
        });
    }

    /*
    * @param field
    * @return boolean
    */
    private isValid(field) {
        return field && typeof field === 'object' && field.isValid();
    }

    /*
    * @return void
    */
    private loadPreferences() {
        this.timeZone = this.session.getSessionData('timezone') || moment.tz.guess();
        let preferences = this.userPreferences.unchangedPreferences.global;
        this.weekStartDay = preferences.week_day_start == "Monday" ? 1 : 0 || this.weekStartDay;
        this.weekDaysCount = +preferences.week_days_count || this.weekDaysCount;
        this.startHour = +preferences.calendar_day_start_hour || this.startHour;
        this.endHour = +preferences.calendar_day_end_hour || this.endHour;
        this.calendarDate = moment(this.calendarDate);
    }

    /*
    * get other calendars ids for the calendar monitor
    * @return void
    */
    private getOtherCalendars() {
        if (this.isMobileView || this.isDashlet) return;
        this.userPreferences.loadPreferences("Calendar")
            .pipe(take(1))
            .subscribe(calendars => {
                this.setUserCalendars(calendars.Users, false);
                this.setOtherCalendars(calendars.Other, false);
                this.getSysUICalendars();
            });
        if (this.session.authData.googleToken) {
            this.loggedByGoogle = true;
        }
    }

    /*
    * @return void
    */
    private getSysUICalendars() {
        this.backend.getRequest('calendar/calendars')
            .subscribe(calendars => {
                this.sysUICalendars = calendars;
                this.isAllToken = this.sysUICalendars.length == this.otherCalendars.length;
            });
    }

    /*
    * @return void
    */
    private subscribeToLanguage() {
        let languageSubscriber = this.language.currentlanguage$.subscribe(lang => this.calendarDate = moment(this.calendarDate));
        this.subscriptions.add(languageSubscriber);
    }
}
