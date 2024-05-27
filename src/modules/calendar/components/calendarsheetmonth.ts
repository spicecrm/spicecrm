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
import {asapScheduler, Subscription} from "rxjs";
import {navigationtab} from "../../../services/navigationtab.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display calendar events in month view
 */
@Component({
    selector: 'calendar-sheet-month',
    templateUrl: '../templates/calendarsheetmonth.html',
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
    @ViewChild('sheetContainer', {read: ViewContainerRef, static: true}) public sheetContainer: ViewContainerRef;
    /**
     * the change date comes from the parent
     */
    @Input() public setdate: any = {};
    /**
     * holds a boolean of google events visibility
     */
    @Input() public groupwareVisible: boolean = true;
    /**
     * holds the month grid weeks and days
     */
    public monthGrid: Array<Array<{ day: number, month: number, date: any, events: any[]}>> = [];
    /**
     * holds the weeks indices to quick access the week index by number
     * @private
     */
    public weeksIndices: { [key: number]: number } = {};
    /**
     * holds the days indices to quick access the day index by number
     * @private
     */
    public daysIndices: { [key: string]: number } = {};
    /**
     * holds the offset height of a grid day
     */
    public offsetHeight: number = 20;
    /**
     * holds the owner events
     */
    public ownerEvents: any[] = [];
    /**
     * holds the users events
     */
    public userEvents: any[] = [];
    /**
     * holds the google events
     */
    public groupwareEvents: any[] = [];
    /**
     * holds the resize listener
     */
    public resizeListener: any;
    /**
     * subscription to handle unsubscribe
     */
    public subscription: Subscription = new Subscription();
    /**
     * holds the maximum amount of event to be rendered in the day cell based on the cell height
     */
    public maxEventsPerDay: number = 1;

    constructor(public language: language,
                public broadcast: broadcast,
                public navigation: navigation,
                public elementRef: ElementRef,
                public backend: backend,
                public renderer: Renderer2,
                public navigationTab: navigationtab,
                public cdRef: ChangeDetectorRef,
                public calendar: calendar) {
        this.buildSheetDays();
        this.subscribeToChanges();
    }

    /**
     * @return allEvents: [ownerEvents, userEvents, groupwareEvents]
     */
    get allEvents(): { style, data, start, end, isMulti: boolean, color: string, id: string, weeksI: number[], sequence: number, illusions: any[], visible: boolean, existsInRanges: any }[] {
        return this.ownerEvents.concat(this.userEvents, this.groupwareEvents);
    }

    /**
     * @return event height
     */
    get eventHeight() {
        return !this.calendar.isMobileView ? 25 : 20;
    }

    /**
     * set the maximum amount of events to be rendered in the day cell bsed on the height of the container
     */
    private setMaxEventsPerDay() {
        const dayContainerHeight = this.sheetContainer ? this.sheetContainer.element.nativeElement.clientHeight / 5 : undefined;
        this.maxEventsPerDay = dayContainerHeight ? Math.floor((dayContainerHeight - (this.offsetHeight * 2)) / this.eventHeight) : 1;
        this.cdRef.detectChanges();
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
        this.setMaxEventsPerDay();
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
        if (changes.groupwareVisible || changes.setdate) {
            this.getGroupwareEvents();
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
    public subscribeToChanges() {
        this.subscription.add(this.calendar.userCalendarChange$.subscribe(calendar => {
                if (calendar.id == 'owner') {
                    this.getOwnerEvents();
                } else {
                    this.getUserEvents(calendar);
                }
            })
        );
        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.setMaxEventsPerDay();
            this.setEventsStyle();
        });

        this.subscription.add(
            this.navigation.activeTab$.subscribe(tabId => {

                if (this.navigationTab.objecttab.id != tabId) return;

                // wait until the tab is visible and the reset the events styles
                asapScheduler.schedule(() => {
                    this.setMaxEventsPerDay();
                    this.setEventsStyle();
                }, 100);
            })
        );
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
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFnDate(index, item) {
        return index;
    }

    /**
     * build sheet days
     */
    public buildSheetDays() {
        this.sheetDays = [];
        let i = 0;
        let dayIndex = this.calendar.weekStartDay;
        let days = moment.weekdaysShort();
        while (i < this.calendar.weekDaysCount) {
            this.sheetDays.push({index: i, text: days[dayIndex], day: dayIndex});
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
    public getOwnerEvents() {
        this.ownerEvents = [];
        this.handleEventsChanges();

        if (!this.calendar.ownerCalendarVisible) {
            return;
        }

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.ownerEvents = events;
                    this.handleEventsChanges();
                }
            });
    }

    /**
     * load google events from service and rearrange the multi events
     */
    public getGroupwareEvents() {
        this.groupwareEvents = [];
        this.handleEventsChanges();

        if (!this.groupwareVisible || this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadGroupwareEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.groupwareEvents = events;
                    this.handleEventsChanges();
                }
            });
    }

    public getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));
        this.handleEventsChanges();

        if (this.calendar.isMobileView || !calendar.visible) {
            return;
        }

        this.calendar.loadUserEvents(this.startDate, this.endDate, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.handleEventsChanges();
                }
            });
    }

    /**
     * load other user events from service and rearrange the multi events
     */
    public getUsersEvents() {
        this.userEvents = [];
        this.handleEventsChanges();

        if (this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadUsersEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.handleEventsChanges();
                }
            });
    }

    /**
     * spread events into the sheet cells and set events style
     * @private
     */
    private handleEventsChanges() {
        this.monthGrid.forEach(week => week.forEach(day => {
            day.events = [];
        }));
        this.spreadEvents();
        this.setEventsStyle();
    }


    /**
     * sort events by duration.
     * assign to each event an array of the week indices where the multi event was found.
     * filter out the invisible events which will be pushed to the more popover.
     */
    public spreadEvents() {

        this.allEvents
            .sort((a,b) => a.start.isBefore(b.start) ? -1 : 1)
            .sort((a,b) => a.end.diff(a.start, 'day') > b.end.diff(b.start, 'day') && a.start.isSameOrBefore(b.start, 'day') ? -1 : 1)
            .forEach(event => {

                delete event.sequence;
                event.existsInRanges = {};


                if (event.isMulti) {
                    this.spreadEventIntoRanges(event);

                } else {
                    const day = this.monthGrid[this.weeksIndices[event.start.week()]][this.daysIndices[`${event.start.month()}${event.start.date()}`]];

                    if (!day) return;

                    event.existsInRanges[day.date.week()] = {from: day.date.format(), to: day.date.format()};

                    event.sequence = day.events.sort((a, b) => a.sequence > b.sequence ? 1 : -1).reduce((acc, e) => acc +1 == e.sequence ? acc + 1 : acc, 0) + 1;
                    day.events.push(event);
                }
            });

        this.cdRef.detectChanges();
    }

    /**
     * get event days difference
     * @private
     * @param start
     * @param end
     * @param isAllDay
     */
    private getDaysDiff(start, end, isAllDay: boolean): number {

        let eventDaysDiff = Math.ceil(end.diff(start, 'day', true).toFixed(1));

        if (!isAllDay && eventDaysDiff > 0 && end.hour() == 0 && end.minute() == 0) {
            eventDaysDiff--;
        }

        return eventDaysDiff;
    }

    /**
     * loop through the event days and push the event to the day.events
     * define the ranges that the event exists in
     * @param event
     * @private
     */
    private spreadEventIntoRanges(event) {

        const daysDiff = this.getDaysDiff(event.start, event.end, event.isAllDay);

        Array.from({length: daysDiff +1}, (_, i) => moment(event.start).add(i, 'days'))
            .forEach(eventDay => {
                const day = this.monthGrid[this.weeksIndices[eventDay.week()]][this.daysIndices[`${eventDay.month()}${eventDay.date()}`]];

                if (!day) return;

                const lastDayOfWeek = this.monthGrid[this.weeksIndices[day.date.week()]][this.monthGrid[this.weeksIndices[day.date.week()]].length - 1].date;

                if (!event.existsInRanges[day.date.week()]) {
                    event.existsInRanges[day.date.week()] = {from: day.date.format()};
                    if (day.date.isSame(lastDayOfWeek, 'days')) {
                        event.existsInRanges[day.date.week()].to = lastDayOfWeek.format();
                    }
                    if (day.date.isSame(event.end, 'days') || daysDiff == 0) {
                        event.existsInRanges[day.date.week()].to = day.date.format();
                    }
                } else if (!event.existsInRanges[day.date.week()].to && event.end.isBefore(lastDayOfWeek)) {
                    event.existsInRanges[day.date.week()].to = event.end.format();
                } else if (!event.existsInRanges[day.date.week()].to) {
                    event.existsInRanges[day.date.week()].to = lastDayOfWeek.format();
                }

                if (isNaN(event.sequence)) {
                    event.sequence = day.events.sort((a, b) => a.sequence > b.sequence ? 1 : -1).reduce((acc, e) => acc +1 == e.sequence ? acc + 1 : acc, 0) + 1;
                }

                day.events.push(event);
            });
    }

    /**
     * navigate to day
     * @param sheetDay
     */
    public gotoDay(sheetDay) {
        let navigateDate = moment(this.setdate);
        navigateDate.month(sheetDay.month).date(sheetDay.day);
        this.calendar.gotToDayView(navigateDate);
    }

    /**
     * @param weekdayShort
     * @return day col style
     */
    public getDayColStyle(weekdayShort) {
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
    public getDayDividerStyle(day) {
        return {
            left: (this.sheetContainer.element.nativeElement.clientWidth / this.calendar.weekDaysCount * day) + 'px',
            top: '0px',
            height: '100%'
        };
    }

    /**
     * build month grid
     */
    public buildGrid() {

        this.monthGrid = [];
        this.weeksIndices = {};
        this.daysIndices = {};

        const firstWeek = moment(this.setdate.format()).date(1).day(this.calendar.weekStartDay).format();

        this.monthGrid = Array.from(
            {length: 5},
            (_, w) => moment(moment(firstWeek).add(w, 'weeks'))
        ).map(w => Array.from(
            {length: this.calendar.weekDaysCount},
            (_, i) => {
                const date = moment(moment(w).day(this.calendar.weekStartDay + i).format());
                return {date, day: date.date(), month: date.month(), events: []};
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
    public notThisMonth(month): boolean {
        return month !== this.setdate.month();
    }

    /**
     * @param week
     * @return week divider style
     */
    public getWeekDividerStyle(week): any {
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
    public getDayStyle(weekIndex, dayIndex, month): any {
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
    public setEventsStyle() {
        this.allEvents.forEach(event => {

            Object.keys(event.existsInRanges).forEach(weekNum =>
                event.existsInRanges[weekNum].style = this.getEventStyle(event, event.existsInRanges[weekNum], weekNum)
            );
        });
        this.cdRef.detectChanges();
    }

    /**
     * set event style
     * @param event
     * @param range
     * @param weekNum
     */
    public getEventStyle(event, range: {from: string, to: string, style?: any}, weekNum: string) {

        const sequence = event.sequence - 1;

        if ((sequence) >= this.maxEventsPerDay) {
            return {display: 'none'};
        }

        const startDate = moment(range.from);
        const length = this.getDaysDiff(startDate, moment(range.to), event.isAllDay) + 1;

        const sheetContainer = this.sheetContainer.element.nativeElement;

        return {
            left: ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * (this.daysIndices[`${startDate.month()}${startDate.date()}`])) + 'px',
            width: ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * length) + 'px',
            top: (this.offsetHeight + ((sheetContainer.clientHeight / this.monthGrid.length) * this.weeksIndices[weekNum]) + (this.eventHeight * sequence)) + 'px',
            height: this.eventHeight + 'px',
            display: 'block'
        };
    }

    /**
     * @param day
     * @param month
     * @return today style
     */
    public isTodayStyle(day, month) {
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

    /**
     * open add modal
     */
    public openAddModal(date) {
        this.calendar.addingEvent$.emit(date);
    }
}
