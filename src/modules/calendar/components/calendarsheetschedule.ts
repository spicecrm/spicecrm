/**
 * @module ModuleCalendar
 */
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {session} from '../../../services/session.service';
import {backend} from '../../../services/backend.service';
import {calendar} from '../services/calendar.service';

/**
* @ignore
*/
declare var moment: any;
/**
* @ignore
*/
declare var _: any;

@Component({
    selector: 'calendar-sheet-schedule',
    templateUrl: './src/modules/calendar/templates/calendarsheetschedule.html'
})
export class CalendarSheetSchedule implements OnChanges {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @Output() public untildate$: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef, static: true}) private calendarsheet: ViewContainerRef;
    @Input() private setdate: any = {};
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('othercalendars') private otherCalendars: any[] = [];
    @Input('googleisvisible') private googleIsVisible: boolean = true;
    private allevents: any[] = [];
    private ownerEvents: any[] = [];
    private otherEvents: any[] = [];
    private userEvents: any[] = [];
    private googleEvents: any[] = [];
    private untilDate: any = {};

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private session: session,
                private calendar: calendar) {
        this.untilDate = new moment().hour(0).minute(0).second(0).add(1, "M");
    }

    get allEvents() {
        return this.allevents;
    }

    get showNoneMsg() {
        return this.allEvents.length == 0 && this.calendar.isDashlet;
    }

    set allEvents(value) {
        let events = this.groupByDay(this.ownerEvents.concat(this.userEvents, this.otherEvents, this.googleEvents));
        events.sort((a, b) => a.date - b.date);
        this.allevents = events;
    }

    get startDate() {
        return new moment(this.setdate).hour(0).minute(0).second(0);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.setUntilDate();
            this.getEvents();
        }

        if (changes.usersCalendars || changes.setdate) {
            this.getUsersEvents();
        }
        if (changes.otherCalendars || changes.setdate) {
            this.getOtherEvents();
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private trackByFnDate(index, item) {
        return index;
    }

    private setUntilDate() {
        this.untilDate = moment(this.setdate).add(1, "M");
        this.untildate$.emit(this.untilDate);
    }

    private getUntilDate() {
        return this.untilDate.format('MMM D, Y');
    }

    private groupByDay(events) {
        let days = [];
        let date = new moment(this.setdate).hour(0).minute(0).second(0);

        for (let event of events) {
            let start = new moment(event.start).hour(0).minute(0).second(0);
            let end = new moment(event.end).hour(0).minute(0).second(0);
            for (let eventDay = moment(start); eventDay.diff(end, 'days') <= 0; eventDay.add(1, 'days')) {
                let sameDay = date.year() == eventDay.year() && date.month() == eventDay.month() && date.date() == eventDay.date();

                if (eventDay.isAfter(date) || sameDay) {
                    let day = {
                        year: eventDay.year(),
                        month: eventDay.month(),
                        day: eventDay.date(),
                        date: moment(eventDay),
                        events: [event]
                    };
                    let dayIndex = -1;

                    days.some((day, index) => {
                        if (day.year == eventDay.year() && day.month == eventDay.month() && day.day == eventDay.date()) {
                            dayIndex = index;
                            return true;
                        }
                    });

                    if (days.length > 0 && dayIndex > -1) {
                        days[dayIndex].events.push(event);
                    } else {
                        days.push(day);
                    }
                }
            }
        }
        return days;
    }

    private getEvents() {
        this.ownerEvents = [];
        this.allEvents = this.allevents.slice();

        this.calendar.loadEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.ownerEvents = events;
                }
                this.allEvents = this.allevents.slice();
            });
    }

    private getGoogleEvents() {
        this.googleEvents = [];

        if (!this.googleIsVisible || this.calendar.isMobileView) {
            this.allEvents = this.allevents.slice();
            return;
        }

        this.calendar.loadGoogleEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                this.googleEvents = events;
                this.allEvents = this.allevents.slice();
            });
    }

    private getUsersEvents() {
        this.userEvents = [];
        this.allEvents = this.allevents.slice();
        if (this.calendar.isMobileView) {
            return;
        }

        for (let i = 0; i < this.calendar.usersCalendars.length; i++) {
            let calendar = this.calendar.usersCalendars[i];
            let last = this.calendar.usersCalendars.length == (i + 1);
            this.calendar.loadEvents(this.startDate, this.untilDate, calendar.id)
                .subscribe(events => {
                    if (events.length > 0) {
                        events.forEach(event => {
                            event.color = calendar.color;
                            event.visible = calendar.visible;
                            if (calendar.visible) {
                                this.userEvents.push(event);
                            }
                            if (last) {
                                this.allEvents = this.allevents.slice();
                            }
                        });
                    } else if (last) {
                        this.allEvents = this.allevents.slice();
                    }
                });
        }
    }

    private getOtherEvents() {
        this.otherEvents = [];
        this.allEvents = this.allevents.slice();
        if (this.calendar.isMobileView) {
            return;
        }

        for (let i = 0; i < this.calendar.otherCalendars.length; i++) {
            let calendar = this.calendar.otherCalendars[i];
            let last = this.calendar.otherCalendars.length == (i + 1);
            this.calendar.loadEvents(this.startDate, this.untilDate, calendar.id, true)
                .subscribe(events => {
                    if (events.length > 0) {
                        events.forEach(event => {
                            event.color = calendar.color;
                            event.visible = calendar.visible;
                            if (calendar.visible) {
                                this.otherEvents.push(event);
                            }
                            if (last) {
                                this.allEvents = this.allevents.slice();
                            }
                        });
                    } else if (last) {
                        this.allEvents = this.allevents.slice();
                    }
                });
        }
    }

    private getShortDay(date) {
        return new moment(date).format('ddd');
    }

    private getMonthDayYear(date) {
        return new moment(date).format('MMM D, YYYY');
    }

    private goToDay(date) {
        this.navigateday.emit(date);
    }

    private getTime(start, end, isMulti) {
        return !isMulti ? `${start.format('HH:mm')} - ${end.format('HH:mm')} ` : 'All Day';
    }

    private loadMore() {
        this.untilDate = moment(this.untilDate).add(1, "M");
        this.untildate$.emit(this.untilDate);
        this.getEvents();
        this.getGoogleEvents();
        this.getUsersEvents();
        this.getOtherEvents();
    }
}
