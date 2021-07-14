/*
SpiceUI 2018.10.001

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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
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
     * holds all events contacted
     */
    protected eventDays: any[] = [];
    /**
     * the change date comes from the parent
     */
    @Input() private setdate: any = {};
    /**
     * holds a boolean of google events visibility
     */
    @Input() private googleIsVisible: boolean = true;
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
                private cdRef: ChangeDetectorRef,
                private calendar: calendar) {
        this.untilDate = new moment().hour(0).minute(0).second(0).add(1, "M");

        this.subscription.add(this.calendar.userCalendarChange$.subscribe(calendar => {
            if (calendar.id == 'owner') {
                this.getOwnerEvents();
            } else {
                this.getUserEvents(calendar);
            }
            })
        );
    }

    /**
     * @return boolean show/hide none msg
     */
    get showNoRecordsMsg() {
        return this.eventDays.length == 0 && this.calendar.isDashlet;
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
            this.getUsersEvents();
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
     * assign an array of days that holds the events
     */
    private setEventDays() {
        let events = this.groupByDay(this.ownerEvents.concat(this.userEvents, this.googleEvents));
        events.forEach(event => event.events.sort((a, b) => a.start - b.start));
        this.eventDays = events.sort((a, b) => a.date - b.date);
        this.cdRef.detectChanges();
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
                    event.timeText = !event.isMulti ? `${event.start.format('HH:mm')} - ${event.end.format('HH:mm')} ` : 'All Day';
                    let day = {
                        year: eventDay.year(),
                        month: eventDay.month(),
                        day: eventDay.date(),
                        date: moment(eventDay),
                        dateText: moment(eventDay).format('MMM D, YYYY'),
                        dayShortText: moment(eventDay).format('ddd'),
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
                        days[dayIndex].events.push({...event});
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
        this.setEventDays();

        if (!this.calendar.ownerCalendarVisible) return this.cdRef.detectChanges();

        this.calendar.loadEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.ownerEvents = events;
                }
                this.setEventDays();
            });
    }

    /**
     * load google events from service and rearrange the multi events
     */
    private getGoogleEvents() {
        this.googleEvents = [];

        if (!this.googleIsVisible || this.calendar.isMobileView) {
            this.setEventDays();
            return;
        }

        this.calendar.loadGoogleEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                this.googleEvents = events;
                this.setEventDays();
            });
    }

    /**
     * load other user events from service and rearrange the multi events
     */
    private getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.setEventDays();

        if (this.calendar.isMobileView || !calendar.visible) {
            return;
        }

        this.calendar.loadUserEvents(this.startDate, this.untilDate, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.setEventDays();
                }
            });
    }

    /**
     * load other users events from service and rearrange the multi events
     */
    private getUsersEvents() {
        this.userEvents = [];
        this.setEventDays();
        if (this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadUsersEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = events;
                    this.setEventDays();
                }
            });
    }

    /**
     * navigate to day
     * @param date
     */
    private goToDay(date) {
        this.calendar.gotToDayView(date);
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
