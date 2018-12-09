import {EventEmitter, Injectable} from '@angular/core';
import {of, Subject} from 'rxjs';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {userpreferences} from "../../../services/userpreferences.service";
import {broadcast} from "../../../services/broadcast.service";
import {modal} from "../../../services/modal.service";


declare var moment: any;
declare var _: any;

@Injectable()
export class calendar {

    public usersCalendars$: EventEmitter<any> = new EventEmitter<any>();
    public otherCalendars$: EventEmitter<any> = new EventEmitter<any>();
    public usersCalendars: any[] = [];
    public otherCalendars: any[] = [];
    public sysUICalendars: any[] = [];
    public calendarDate: any = {};
    public calendars: any = {};
    public currentStart: any = null;
    public currentEnd: any = null;
    public sheetHourHeight: number = 80;
    public multiEventHeight: number = 25;
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

    constructor(private backend: backend,
                private session: session,
                private broadcast: broadcast,
                private modal: modal,
                private modelutilities: modelutilities,
                private userPreferences: userpreferences) {
        this.loadPreferences();
        this.getOtherCalendars();
        this.modelChangesSubscriber();
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

    public addEvent(obj) {
        console.log(obj);
    }

    public addOtherCalendar() {
        if (this.isAllToken) {return}
        let calendars = this.sysUICalendars.filter(calendar => !this.otherCalendars.some(token => token.id == calendar.id));

        this.modal.openModal('CalendarAddCalendar').subscribe(modalRef => {
            modalRef.instance.calendars = calendars;
            modalRef.instance.addCalendar.subscribe(calendar => {
                if (calendar !== false) {
                    let otherCalendars = this.otherCalendars;
                    otherCalendars.push({
                        id: calendar.id,
                        name: calendar.name,
                        visible: true,
                        color: '#' + (Math.random() * 0xFFF << 0).toString(16).toLowerCase() == "fff" ? "ddd" : (Math.random() * 0xFFF << 0).toString(16)
                    });
                    this.setOtherCalendars(otherCalendars.slice());
                }
            })
        });
    }

    public setOtherCalendars(calendars, save = true) {
        if (!calendars) {return}

        this.otherCalendars = calendars;
        if (save) {
            this.userPreferences.setPreference("Other", this.otherCalendars, true, "Calendar");
        }
        this.otherCalendars$.emit(this.otherCalendars);
        this.isAllToken = this.sysUICalendars.length == this.otherCalendars.length;
    }

    public removeOtherCalendar(id) {
        let otherCalendars = this.otherCalendars.filter(calendar => calendar.id != id);
        this.setOtherCalendars(otherCalendars);
    }

    public addUserCalendar(id, name) {
        let usersCalendars = this.usersCalendars;
        usersCalendars.push({
            id: id,
            name: name,
            visible: true,
            color: '#' + (Math.random() * 0xFFF << 0).toString(16).toLowerCase() == "fff" ? "ddd" : (Math.random() * 0xFFF << 0).toString(16)
        });
        this.setUserCalendars(usersCalendars.slice());
    }

    public removeUserCalendar(id) {
        let usersCalendars = this.usersCalendars.filter(calendar => calendar.id != id);
        this.setUserCalendars(usersCalendars);
    }

    public setUserCalendars(calendars, save = true) {
        if (!calendars) {return}

        this.usersCalendars = calendars;
        if (save) {
            this.userPreferences.setPreference("Users", this.usersCalendars, true, "Calendar");
        }
        this.usersCalendars$.emit(this.usersCalendars);
    }

    public doReload(start, end, calendar = this.owner) {
        return !this.currentStart || !this.currentEnd || this.currentStart > start || this.currentEnd < end ||
            !this.calendars[calendar] || (this.calendars[calendar] && this.calendars[calendar].length == 0);
    }

    public loadEvents(start, end, calendar = this.owner, isOther = false) {
        // check if we need to reload
        if (this.doReload(start, end, calendar)) {
            // set current search parameters
            this.currentEnd = end;
            this.currentStart = start;

            let responseSubject = new Subject<Array<any>>();
            let params = {
                start: start.format('YYYY-MM-DD HH:mm:ss'),
                end: end.format('YYYY-MM-DD HH:mm:ss')
            };
            let endPoint = !isOther ? 'calendar/' : 'calendar/other/';

            this.backend.getRequest(endPoint + calendar, params).subscribe(events => {
                this.calendars[calendar] = [];
                for (let event of events) {
                    event.data = this.modelutilities.backendModel2spice(event.module, event.data);
                    switch (event.type) {
                        case 'event':
                            event.start = moment(event.start).tz(moment.tz.guess()).add(moment().utcOffset(), 'm');
                            event.end = moment(event.end).tz(moment.tz.guess()).add(moment().utcOffset(), 'm');
                            event.color = this.eventColor;
                            break;
                        case 'absence':
                            event.start = moment(event.start).second(1);
                            event.end = moment(event.end).second(1);
                            event.isMulti = true;
                            event.color = this.absenceColor;
                            event.data.summary_text = event.data.type;
                            break;
                        case 'other':
                            event.start = moment(event.start).year(start.year()).second(1);
                            event.end = moment(event.end).year(start.year()).second(1);
                            event.isMulti = true;
                            break;
                    }

                    if (+event.end.diff(event.start, 'days') > 0) {
                        event.isMulti = true;
                    }

                    this.calendars[calendar].push(event);
                }
                responseSubject.next(this.calendars[calendar]);
                responseSubject.complete();
            });
            return responseSubject.asObservable();
        } else {
            // filter the current eventset based on the start and end date
            let filteredEntries: Array<any> = [];
            for (let event of this.calendars[calendar]) {
                if (event.start < end && event.end > start) {
                    filteredEntries.push(event);
                }
            }
            return of(filteredEntries);
        }
    }

    public getEvents(calendar = this.owner) {
        return this.calendars[calendar] ? this.calendars[calendar] : [];
    }

    // internal function to manage the display .. adding diaplyindex and overly count to each event
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

    private modelChangesSubscriber() {
        this.broadcast.message$.subscribe(message => {
            if ((message.messagedata.module == "Meetings" || message.messagedata.module == "Calls")) {

                switch (message.messagetype) {
                    case "model.save":
                        let uid = message.messagedata.data.assigned_user_id;
                        if (!this.calendars[uid]) {return}
                        let exists = this.calendars[uid].some(event => {
                            if (event.id == message.messagedata.id) {
                                event.data = message.messagedata.data;
                                event.start = message.messagedata.data.date_start;
                                event.end = message.messagedata.data.date_end;
                                this.calendarDate = moment(this.calendarDate);
                                return true;
                            }
                        });

                        if (!exists) {
                            this.calendars[uid].push({
                                id: message.messagedata.id,
                                module: message.messagedata.module,
                                type: "event",
                                start: message.messagedata.data.date_start,
                                end: message.messagedata.data.date_end,
                                data: message.messagedata.data
                            });
                            this.calendarDate = moment(this.calendarDate);
                        }
                        break;
                    case "model.delete":
                        if (!this.calendars[this.owner]) {return}
                        this.calendars[this.owner].some(event => {
                            if (event.id == message.messagedata.id) {
                                this.calendars[this.owner] = this.calendars[this.owner].filter(e => e.id != event.id);
                                this.calendarDate = moment(this.calendarDate);
                                return true;
                            }
                        });
                        break;
                }
            }
        });
    }

    private loadPreferences() {
        this.weekStartDay = this.userPreferences.unchangedPreferences.global['week_day_start'] == "Monday" ? 1 : 0 || this.weekStartDay;
        this.weekDaysCount = +this.userPreferences.unchangedPreferences.global['week_days_count'] || this.weekDaysCount;
        this.startHour = +this.userPreferences.unchangedPreferences.global['calendar_day_start_hour'] || this.startHour;
        this.endHour = +this.userPreferences.unchangedPreferences.global['calendar_day_end_hour'] || this.endHour;
        this.calendarDate = moment();
    }

    private getOtherCalendars() {
        this.userPreferences.loadPreferences("Calendar").subscribe(calendars => {
            this.setUserCalendars(calendars["Users"], false);
            this.setOtherCalendars(calendars["Other"], false);
            this.getSysUICalendars();
        });
        if (this.session.authData.googleToken) {
            this.loggedByGoogle = true;
        }
    }

    private getSysUICalendars(){
        this.backend.getRequest('calendar/calendars').subscribe(calendars => {
            this.sysUICalendars = calendars;
            this.isAllToken = this.sysUICalendars.length == this.otherCalendars.length;
        });
    }
}
