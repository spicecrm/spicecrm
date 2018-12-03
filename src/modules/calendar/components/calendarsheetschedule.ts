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

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar-sheet-schedule',
    templateUrl: './src/modules/calendar/templates/calendarsheetschedule.html',
})
export class CalendarSheetSchedule implements OnChanges {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @Output() public untildate$: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('googlecalendarvisible') private googleCalendarVisible: boolean = true;
    @Input() private setdate: any = {};
    private allevents: Array<any> = [];
    private ownerEvents: Array<any> = [];
    private otherEvents: any = [];
    private googleEvents: Array<any> = [];
    private untilDate: any = {};
    private isLoading: boolean = false;
    private loaded: any = {
        owner: false,
        google: false,
        other: false,
    };

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private session: session,
                private calendar: calendar) {
        this.untilDate = new moment().hour(0).minute(0).second(0).add(1, "M");
    }

    set allEvents(value) {
        let events = this.groupByDay(this.ownerEvents.concat(this.otherEvents, this.googleEvents));
        events.sort((a, b) => a.date - b.date);
        this.allevents = events;
    }

    get allEvents() {
        return this.allevents;
    }

    private setLoaded(category, value) {
        this.loaded[category] = value;
        if (this.loaded.owner && this.loaded.google && this.loaded.other) {
            this.isLoading = false;
            this.allEvents = this.allEvents.slice();
        }
    }

    private getUntilDate() {
        return this.untilDate.format('MMM D, Y');
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.isLoading = true;
            this.getEvents();
            this.getUsersEvents();
            this.getGoogleEvents(true);
        }
        if (changes.usersCalendars) {
            this.isLoading = true;
            this.getUsersEvents();
        }
        if (changes.googleCalendarVisible) {
            this.getGoogleEvents();
        }
    }

    private groupByDay(events) {
        let days = [];
        let date = new moment(this.setdate).hour(0).minute(0).second(0);

        for (let event of events) {
            let start = new moment(event.start).hour(0).minute(0).second(0);
            let end = new moment(event.end).hour(0).minute(0).second(0);
            for (let eventDay = moment(start); eventDay.diff(end, 'days') <= 0; eventDay.add(1, 'days')) {
                if (eventDay.isAfter(date) || date.year() == eventDay.year() && date.month() == eventDay.month() && date.date() == eventDay.date()) {

                    let day = {year: eventDay.year(), month: eventDay.month(), day: eventDay.date(), date: moment(eventDay), events: [event]};
                    let dayIndex = -1;

                    days.some((day, index) => {
                        if (day.year == eventDay.year() && day.month == eventDay.month() &&  day.day == eventDay.date()) {
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
        let startDate = new moment(this.setdate).hour(0).minute(0).second(0);

        this.calendar.loadEvents(startDate, this.untilDate).subscribe(events => {
            if (events.length > 0) {
                this.ownerEvents = events;
            }
            this.setLoaded('owner', true);
        });
    }

    private getGoogleEvents(reload = false) {
        if (!this.calendar.loggedByGoogle) {
            this.setLoaded('google', true);
            return;
        }
        let startDate = new moment(this.setdate).hour(0).minute(0).second(0);
        let params = {
            startdate: startDate.format('YYYY-MM-DD HH:mm:ss'),
            enddate: this.untilDate.format('YYYY-MM-DD HH:mm:ss')
        };

        if (reload) {
            this.googleEvents = [];
            this.backend.getRequest("google/calendar/getgoogleevents", params).subscribe(res => {
                if (res && res.length > 0) {
                    let events = res.map(event => {
                        event.start = moment(event.start.dateTime).tz(moment.tz.guess()).add(moment().utcOffset(), 'm');
                        event.end = moment(event.end.dateTime).tz(moment.tz.guess()).add(moment().utcOffset(), 'm');
                        if (+event.end.diff(event.start, 'days') > 0) {
                            event.isMulti = true;
                        }
                        event.data = {};
                        event.data.summary_text = event.summary;
                        event.data.assigned_user_id = null;
                        event.color = this.calendar.googleColor;
                        event.visible = this.googleCalendarVisible;
                        return event;
                    });
                    this.calendar.calendars["google"] = events;
                    this.googleEvents = events.filter(event => event.visible);
                }
                this.setLoaded('google', true);
            });
        } else {
            let events = this.calendar.calendars["google"];
            if (events) {
                events = events.map(event => {
                    event.visible = this.googleCalendarVisible;
                    return event;
                });
                this.googleEvents = this.googleEvents.concat(events.filter(event => event.visible && event.start < this.untilDate && event.end > startDate));
            }
            this.setLoaded('google', true);
        }
    }

    private getUsersEvents() {
        let startDate = new moment(this.setdate).hour(0).minute(0).second(0);
        this.otherEvents = [];
        for (let i = 0; i < this.calendar.usersCalendars.length; i++) {
            let calendar = this.calendar.usersCalendars[i];
            this.calendar.loadEvents(startDate, this.untilDate, calendar.id).subscribe(events => {
                if (events.length > 0) {
                    events.forEach(event => {
                        event.color = calendar.color;
                        event.visible = calendar.visible;
                        if (event.visible) {
                            this.otherEvents.push(event);
                        }
                    });
                }
                if ((i + 1) == this.calendar.usersCalendars.length) {
                    this.setLoaded('other', true);
                }
            });
        }
    }

    private displayDate(format) {
        return this.setdate.format(format);
    }

    private isTodayStyle() {
        let today = new moment();
        return {
            color: today.year() === this.setdate.year() && today.month() === this.setdate.month() && today.date() == this.setdate.date() ? this.calendar.todayColor : 'inherit'
        };
    }

    private getSheetStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarsheet.element.nativeElement.offsetTop + 'px)',
        };
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
        this.isLoading = true;
        this.getEvents();
        this.getGoogleEvents(true);
        this.getUsersEvents();
        }
}
