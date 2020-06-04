/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {session} from '../../../services/session.service';
import {backend} from '../../../services/backend.service';
import {calendar} from '../services/calendar.service';
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display calendar events in schedule view
 */
@Component({
    selector: 'calendar-sheet-schedule',
    templateUrl: './src/modules/calendar/templates/calendarsheetschedule.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSheetSchedule implements OnChanges, OnDestroy {
    /**
     * emit the until date change
     */
    @Output() public untildate$: EventEmitter<any> = new EventEmitter<any>();
    /**
     * the change date comes from the parent
     */
    @Input() private setdate: any = {};
    /**
     * holds a boolean of google events visibility
     */
    @Input() private googleIsVisible: boolean = true;
    /**
     * holds all events contacted
     */
    private allevents: any[] = [];
    /**
     * holds the owner events
     */
    private ownerEvents: any[] = [];
    /**
     * holds the users events
     */
    private userEvents: any[] = [];
    /**
     * holds the google events
     */
    private googleEvents: any[] = [];
    /**
     * holds the until date
     */
    private untilDate: any = {};
    /**
     * subscription to handle unsubscribe
     */
    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private session: session,
                private calendar: calendar) {
        this.untilDate = new moment().hour(0).minute(0).second(0).add(1, "M");

        this.subscription.add(this.calendar.userCalendarChange$.subscribe(calendar => {
                this.getUserEvents(calendar);
            })
        );
        this.subscription.add(this.calendar.usersCalendarsLoad$.subscribe(() => {
                this.getUsersEvents();
            })
        );
    }

    /**
     * @return allEvents
     */
    get allEvents() {
        return this.allevents;
    }

    /**
     * set all events
     * @param value
     */
    set allEvents(value) {
        let events = this.groupByDay(this.ownerEvents.concat(this.userEvents, this.googleEvents));
        events.sort((a, b) => a.date - b.date);
        this.allevents = events;
    }

    /**
     * @return boolean show/hide none msg
     */
    get showNoRecordsMsg() {
        return this.allEvents.length == 0 && this.calendar.isDashlet;
    }

    /**
     * @return start date
     */
    get startDate() {
        return new moment(this.setdate).hour(0).minute(0).second(0);
    }

    /**
     * handle input changes to load events
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.setUntilDate();
            this.getOwnerEvents();
            if (this.calendar.usersCalendarsLoaded) {
                this.getUsersEvents();
            }
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    private trackByFnDate(index, item) {
        return index;
    }

    /**
     * set until date
     */
    private setUntilDate() {
        this.untilDate = moment(this.setdate).add(1, "M");
        this.untildate$.emit(this.untilDate);
    }

    /**
     * get until date
     */
    private getUntilDate() {
        return this.untilDate.format('MMM D, Y');
    }

    /**
     * group events by day
     * @param events
     */
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

    /**
     * load owner events from service and rearrange the multi events
     */
    private getOwnerEvents() {
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

    /**
     * load google events from service and rearrange the multi events
     */
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

    /**
     * load other user events from service and rearrange the multi events
     */
    private getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.allEvents = this.allevents.slice();

        if (this.calendar.isMobileView || !calendar.visible) {
            return;
        }

        this.calendar.loadUserEvents(this.startDate, this.untilDate, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.allEvents = this.allevents.slice();
                }
            });
    }

    /**
     * load other users events from service and rearrange the multi events
     */
    private getUsersEvents() {
        this.userEvents = [];
        this.allEvents = this.allevents.slice();
        if (this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadUsersEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = events;
                    this.allEvents = this.allevents.slice();
                }
            });
    }

    /**
     * get event short day format
     * @param date
     */
    private getShortDay(date) {
        return new moment(date).format('ddd');
    }

    /**
     * get event month day year format
     * @param date
     */
    private getMonthDayYear(date) {
        return new moment(date).format('MMM D, YYYY');
    }

    /**
     * navigate to day
     * @param date
     */
    private goToDay(date) {
        this.calendar.gotToDayView(date);
    }

    /**
     * get event time format
     * @param start
     * @param end
     * @param isMulti
     */
    private getTime(start, end, isMulti) {
        return !isMulti ? `${start.format('HH:mm')} - ${end.format('HH:mm')} ` : 'All Day';
    }

    /**
     * load more events
     */
    private loadMore() {
        this.untilDate = moment(this.untilDate).add(1, "M");
        this.untildate$.emit(this.untilDate);
        this.getOwnerEvents();
        this.getGoogleEvents();
        this.getUsersEvents();
    }
}
