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
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {backend} from '../../../services/backend.service';
import {calendar} from '../services/calendar.service';
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display calendar events in month view
 */
@Component({
    selector: 'calendar-sheet-month',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonth.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSheetMonth implements OnChanges, AfterViewInit, OnDestroy {
    /**
     * holds the sheet days moment object
     */
    public sheetDays: any[] = [];
    /**
     * container reference for the main div
     */
    @ViewChild('sheetContainer', {read: ViewContainerRef, static: true}) private sheetContainer: ViewContainerRef;
    /**
     * the change date comes from the parent
     */
    @Input() private setdate: any = {};
    /**
     * holds a boolean of google events visibility
     */
    @Input() private googleIsVisible: boolean = true;
    /**
     * holds the month grid weeks and days
     */
    private monthGrid: Array<Array<{ day: number, month: number, date: any, events: any[], visibleEventsCount: number }>> = [];
    /**
     * holds the weeks indices to quick access the week index by number
     * @private
     */
    private weeksIndices: { [key: number]: number } = {};
    /**
     * holds the days indices to quick access the day index by number
     * @private
     */
    private daysIndices: { [key: string]: number } = {};
    /**
     * holds the offset height of a grid day
     */
    private offsetHeight: number = 20;
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
     * holds the resize listener
     */
    private resizeListener: any;
    /**
     * subscription to handle unsubscribe
     */
    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private renderer: Renderer2,
                private cdRef: ChangeDetectorRef,
                private calendar: calendar) {
        this.buildSheetDays();
        this.subscribeToChanges();
    }

    /**
     * @return allEvents: [ownerEvents, userEvents, googleEvents]
     */
    get allEvents(): Array<{ style, data, start, illusionStart, illusionEnd, end, isMulti: boolean, color: string, id: string, weeksI: number[], sequence: number, illusionSequence: number, illusions: any[], visible: boolean }> {
        return this.ownerEvents.concat(this.userEvents, this.googleEvents);
    }

    /**
     * @return event height
     */
    get eventHeight() {
        return !this.calendar.isMobileView ? 25 : 20;
    }

    /**
     * @return number the max number of events per day
     */
    get maxEventsPerDay() {
        const dayContainerHeight = this.sheetContainer ? this.sheetContainer.element.nativeElement.clientHeight / this.monthGrid.length : undefined;
        return dayContainerHeight ? Math.floor((dayContainerHeight - (this.offsetHeight * 2)) / this.eventHeight) : 1;
    }

    /**
     * @return startDate: moment
     */
    get startDate() {
        return new moment(this.setdate).date(1).hour(0).minute(0).second(0);
    }

    /**
     * @return endDate: moment
     */
    get endDate() {
        return new moment(this.startDate).endOf('month');
    }

    /**
     * detect changes
     */
    public ngAfterViewInit() {
        this.cdRef.detectChanges();
    }

    /**
     * handle input changes to load events
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges) {
        this.buildGrid();
        this.buildSheetDays();

        if (changes.setdate) {
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
    public ngOnDestroy() {
        this.cdRef.detach();
        this.subscription.unsubscribe();
    }

    /**
     * subscribe to user calendar changes
     * subscribe to resize event to reset the events style
     */
    private subscribeToChanges() {
        this.subscription.add(this.calendar.userCalendarChange$.subscribe(calendar => {
                if (calendar.id == 'owner') {
                    this.getOwnerEvents();
                } else {
                    this.getUserEvents(calendar);
                }
            })
        );
        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.setEventsStyle();
            this.setVisibleEventsCount();
        });
    }

    /**
     * set visible events count
     * @private
     */
    private setVisibleEventsCount() {

        this.allEvents.forEach(event => {

            if (event.sequence < this.maxEventsPerDay || !event.visible) return;

            event.visible = false;

            const eventDaysCount = Math.ceil(event.end.diff(event.start, 'day', true));

            Array.from({length: eventDaysCount}, (_, i) => moment(event.start).add(i, 'days'))
                .forEach(eventDay => {
                    const day = this.monthGrid[this.weeksIndices[eventDay.week()]][this.daysIndices[`${eventDay.month()}${eventDay.date()}`]];
                    day.visibleEventsCount--;
                });

            if (!Array.isArray(event.illusions)) return;

            event.illusions.forEach(illusion => {
                const eventDaysCount = Math.ceil(illusion.end.diff(illusion.start, 'day', true));

                Array.from({length: eventDaysCount}, (_, i) => moment(illusion.start).add(i, 'days'))
                    .forEach(eventDay => {
                        const day = this.monthGrid[this.weeksIndices[eventDay.week()]][this.daysIndices[`${eventDay.month()}${eventDay.date()}`]];
                        day.visibleEventsCount--;
                    });
            });
        });
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
     * build sheet days
     */
    private buildSheetDays() {
        this.sheetDays = [];
        let i = 0;
        let dayIndex = this.calendar.weekStartDay;
        let days = moment.weekdaysShort();
        while (i < this.calendar.weekDaysCount) {
            this.sheetDays.push({index: i, text: days[dayIndex]});
            i++;
            dayIndex++;
            if (dayIndex > 6) {
                dayIndex = 0;
            }
        }
    }

    /**
     * load owner events from service and rearrange the multi events
     */
    private getOwnerEvents() {
        this.ownerEvents = [];
        this.cleanGrid();

        if (!this.calendar.ownerCalendarVisible) return this.cdRef.detectChanges();

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.ownerEvents = events;
                    this.spreadEvents();
                    this.setEventsStyle();
                }
            });
    }

    /**
     * load google events from service and rearrange the multi events
     */
    private getGoogleEvents() {
        this.googleEvents = [];
        this.cleanGrid();
        if (!this.googleIsVisible || this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadGoogleEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.googleEvents = events;
                    this.spreadEvents();
                    this.setEventsStyle();
                }
            });
    }

    private getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.cleanGrid();
        if (this.calendar.isMobileView || !calendar.visible) {
            return;
        }

        this.calendar.loadUserEvents(this.startDate, this.endDate, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.spreadEvents();
                    this.setEventsStyle();
                }
            });
    }

    /**
     * load other user events from service and rearrange the multi events
     */
    private getUsersEvents() {
        this.userEvents = [];
        this.cleanGrid();
        if (this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadUsersEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.spreadEvents();
                    this.setEventsStyle();
                }
            });
    }

    /**
     * rebuild the grid to clean up the referenced events in the days
     * @private
     */
    private cleanGrid() {
        this.buildGrid();
    }

    /**
     * sort events by duration.
     * assign to each event an array of the week indices where the multi event was found.
     * filter out the invisible events which will be pushed to the more popover.
     */
    private spreadEvents() {

        this.cleanGrid();
        this.allEvents.forEach(e => {
            delete e.sequence;
            e.illusions = [];
        });

        this.allEvents
            .sort((a, b) => a.start.isBefore(b.start) && a.end.diff(a.start, 'day', true) > b.end.diff(b.start, 'day', true) ? -1 : 1)
            .forEach(event => {
                if (event.isMulti) {

                    const eventDaysCount = Math.ceil(event.end.diff(event.start, 'day', true));

                    // define the day events
                    Array.from({length: eventDaysCount}, (_, i) => moment(event.start).add(i, 'days'))
                        .forEach(eventDay => {
                            const day = this.monthGrid[this.weeksIndices[eventDay.week()]][this.daysIndices[`${eventDay.month()}${eventDay.date()}`]];
                            if (isNaN(event.sequence)) {
                                event.sequence = day.events.length;
                            }
                            day.events.push(event);
                            day.visibleEventsCount++;
                        });
                    const eventWeeksCount = Math.ceil(event.end.diff(event.start, 'week', true));

                    if (eventWeeksCount < 2) return;

                    if (!Array.isArray(event.illusions)) {
                        event.illusions = [];
                    }

                    // define the event weeks
                    Array.from({length: eventWeeksCount}, (_, i) => moment(moment(event.start).day(this.calendar.weekstartday)).add(i, 'weeks'))
                        .forEach(week => {
                            const illusionEvent = {...event};
                            illusionEvent.illusionStart = moment(week.day(this.calendar.weekStartDay));
                            illusionEvent.illusionEnd = illusionEvent.end.isAfter(week, 'weeks') ? moment(week.day(this.calendar.weekDaysCount)) : moment(event.end);
                            event.illusions.push(illusionEvent);
                        });

                } else {
                    const day = this.monthGrid[this.weeksIndices[event.start.week()]][this.daysIndices[`${event.start.month()}${event.start.date()}`]];
                    event.sequence = day.events.length;
                    day.events.push(event);
                    day.visibleEventsCount++;
                }
            });
    }

    /**
     * navigate to day
     * @param sheetDay
     */
    private gotoDay(sheetDay) {
        let navigateDate = moment(this.setdate);
        navigateDate.month(sheetDay.month).date(sheetDay.day);
        this.calendar.gotToDayView(navigateDate);
    }

    /**
     * @param weekdayShort
     * @return day col style
     */
    private getDayColStyle(weekdayShort) {
        let todayDay = new moment();
        let todayDayShort = todayDay.format('ddd');
        let calendarDate = this.calendar.calendarDate;
        let isToday = calendarDate.year() == todayDay.year() && calendarDate.month() == todayDay.month() && todayDayShort == weekdayShort;
        return {
            'width': `calc(100% / ${this.calendar.weekDaysCount})`,
            'color': isToday ? this.calendar.todayColor : 'inherit',
            'font-weight': isToday ? '600' : 'inherit'
        };
    }

    /**
     * @param day
     * @return day divider style
     */
    private getDayDividerStyle(day) {
        return {
            left: (this.sheetContainer.element.nativeElement.clientWidth / this.calendar.weekDaysCount * day) + 'px',
            top: '0px',
            height: '100%'
        };
    }

    /**
     * build month grid
     */
    private buildGrid() {

        this.monthGrid = [];

        const firstWeek = moment(this.setdate.format()).date(1).day(this.calendar.weekStartDay).format();

        this.monthGrid = Array.from(
            {length: 5},
            (_, w) => moment(moment(firstWeek).add(w, 'weeks'))
        ).map(w => Array.from(
            {length: this.calendar.weekDaysCount},
            (_, i) => {
                const date = moment(moment(w).day(this.calendar.weekStartDay + i).format());
                return {date, day: date.date(), month: date.month(), events: [], visibleEventsCount: 0};
            })
        );

        this.monthGrid.forEach((w, i) => {
            w.forEach((d, i) => {
                if(!this.daysIndices[`${d.month}${d.day}`]) {
                    this.daysIndices[`${d.month}${d.day}`] = i;
                }
            });
            this.weeksIndices[w[0].date.week()] = i;
        });
    }

    /**
     * check if the month is not the same as current
     * @param month
     */
    private notThisMonth(month): boolean {
        return month !== this.setdate.month();
    }

    /**
     * @param week
     * @return week divider style
     */
    private getWeekDividerStyle(week): any {
        return {
            top: 'calc((100% / ' + this.monthGrid.length + ') * ' + week + ' )'
        };
    }

    /**
     * @param weekIndex
     * @param dayIndex
     * @param month
     * @return day style
     */
    private getDayStyle(weekIndex, dayIndex, month): any {
        return {
            'left': (this.sheetContainer.element.nativeElement.clientWidth / this.calendar.weekDaysCount * dayIndex) + 'px',
            'top': `calc((100% / ${this.monthGrid.length}) * ${weekIndex})`,
            'color': this.notThisMonth(month) ? '#9faab5' : 'inherit',
            'background-color': this.notThisMonth(month) ? '#f4f6f9' : 'transparent',
            'width': (this.sheetContainer.element.nativeElement.clientWidth / this.calendar.weekDaysCount) + 'px',
            'height': 'calc(100% / ' + this.monthGrid.length + ')',
            'min-height': '70px'
        };
    }

    /**
     * set all events style
     */
    private setEventsStyle() {
        this.allEvents.forEach(event => {

            this.setEventStyle(event);

            if (!Array.isArray(event.illusions)) return;

            event.illusions.forEach(illusionEvent =>
                this.setEventStyle(illusionEvent)
            );
        });
        this.cdRef.detectChanges();
    }

    /**
     * set event style
     * @param event
     */
    private setEventStyle(event) {

        if (event.sequence >= this.maxEventsPerDay) {
            event.style = {display: 'none'};
            return;
        }
        const eventStart = event.illusionStart || event.start;
        const eventEnd = event.illusionEnd || event.end;
        const weekI = this.weeksIndices[eventStart.week()];
        const startDate = eventStart.isBefore(this.monthGrid[weekI][0].date, 'days') ? this.monthGrid[weekI][0].date : eventStart;
        const endDate = eventEnd.isAfter(this.monthGrid[weekI][this.monthGrid[weekI].length - 1].date, 'days') ? this.monthGrid[weekI][this.monthGrid[weekI].length - 1].date : eventEnd;
        const length = Math.ceil(endDate.diff(startDate, 'day', true));
        const sheetContainer = this.sheetContainer.element.nativeElement;

        if (!('style' in event)) {
            event.style = {};
        }

        event.style = {
            left: ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * (this.daysIndices[`${startDate.month()}${startDate.date()}`])) + 'px',
            width: ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * length) + 'px',
            top: (this.offsetHeight + ((sheetContainer.clientHeight / this.monthGrid.length) * weekI) + (this.eventHeight * event.sequence)) + 'px',
            height: this.eventHeight + 'px',
            display: 'block'
        };
    }

    /**
     * @param day
     * @param month
     * @return today style
     */
    private isTodayStyle(day, month) {
        let year = this.calendar.calendarDate.year();
        let today = new moment();
        let isToday = year === today.year() && today.month() === month && today.date() == day;
        return {
            'border-radius': '50%',
            'line-height': '1rem',
            'text-align': 'center',
            'width': '1.1rem',
            'height': '1.1rem',
            'display': 'block',
            'color': isToday ? '#fff' : 'inherit',
            'background-color': isToday ? this.calendar.todayColor : 'inherit',
        };
    }
}
