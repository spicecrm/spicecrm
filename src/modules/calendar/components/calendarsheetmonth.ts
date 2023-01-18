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
    public monthGrid: Array<Array<{ day: number, month: number, date: any, events: any[], visibleEventsCount: number }>> = [];
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

    constructor(public language: language,
                public broadcast: broadcast,
                public navigation: navigation,
                public elementRef: ElementRef,
                public backend: backend,
                public renderer: Renderer2,
                public cdRef: ChangeDetectorRef,
                public calendar: calendar) {
        this.buildSheetDays();
        this.subscribeToChanges();
    }

    /**
     * @return allEvents: [ownerEvents, userEvents, groupwareEvents]
     */
    get allEvents(): { style, data, start, illusionStart, illusionEnd, end, isMulti: boolean, color: string, id: string, weeksI: number[], sequence: number, illusionSequence: number, illusions: any[], visible: boolean }[] {
        return this.ownerEvents.concat(this.userEvents, this.groupwareEvents);
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
            this.setEventsStyle();
            this.setVisibleEventsCount();
        });
    }

    /**
     * set visible events count
     * @private
     */
    public setVisibleEventsCount() {

        this.allEvents.forEach(event => {

            if (event.sequence < this.maxEventsPerDay || !event.visible) return;

            event.visible = false;

            const eventDaysCount = event.end.diff(event.start, 'day') + 1;

            Array.from({length: eventDaysCount}, (_, i) => moment(event.start).add(i, 'days'))
                .forEach(eventDay => {
                    const day = this.monthGrid[this.weeksIndices[eventDay.week()]][this.daysIndices[`${eventDay.month()}${eventDay.date()}`]];
                    day.visibleEventsCount--;
                });

            if (!Array.isArray(event.illusions)) return;

            event.illusions.forEach(illusion => {
                const eventDaysCount = illusion.end.diff(illusion.start, 'day') + 1;

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
    public getGroupwareEvents() {
        this.groupwareEvents = [];
        this.cleanGrid();
        if (!this.groupwareVisible || this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadGroupwareEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.groupwareEvents = events;
                    this.spreadEvents();
                    this.setEventsStyle();
                }
            });
    }

    public getUserEvents(calendar) {
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
    public getUsersEvents() {
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
    public cleanGrid() {
        this.buildGrid();
    }

    /**
     * sort events by duration.
     * assign to each event an array of the week indices where the multi event was found.
     * filter out the invisible events which will be pushed to the more popover.
     */
    public spreadEvents() {

        this.cleanGrid();
        this.allEvents.forEach(e => {
            delete e.sequence;
            e.illusions = [];
        });

        this.allEvents
            .sort((a, b) => a.start.isBefore(b.start) && a.end.diff(a.start, 'day', true) > b.end.diff(b.start, 'day', true) ? -1 : 1)
            .forEach(event => {
                if (event.isMulti) {

                    const eventDaysCount = event.end.diff(event.start, 'day') + 1;

                    // define the day events
                    Array.from({length: eventDaysCount}, (_, i) => moment(event.start).add(i, 'days'))
                        .forEach(eventDay => {
                            const day = this.monthGrid[this.weeksIndices[eventDay.week()]][this.daysIndices[`${eventDay.month()}${eventDay.date()}`]];

                            if (!day) return;

                            if (isNaN(event.sequence)) {
                                event.sequence = day.events.length;
                            }
                            day.events.push(event);
                            day.visibleEventsCount++;
                        });
                    const gridLastWeek = this.monthGrid[this.monthGrid.length -1];
                    let eventEnd = moment(event.end);
                    let eventStart = moment(event.start);

                    if (eventStart.isBefore(this.monthGrid[0][0].date)) {
                        eventStart = this.monthGrid[0][0].date;
                    }
                    if (eventEnd.isAfter(gridLastWeek[gridLastWeek.length - 1].date)) {
                        eventEnd = gridLastWeek[gridLastWeek.length - 1].date;
                    }
                    const eventWeeksCount = eventEnd.diff(eventStart, 'week') + 1;

                    if (eventWeeksCount < 2) return;

                    if (!Array.isArray(event.illusions)) {
                        event.illusions = [];
                    }

                    // define the event weeks
                    Array.from({length: (eventWeeksCount - 1)}, (_, i) => moment(moment(event.start).day(this.calendar.weekstartday)).add(i + 1, 'weeks'))
                        .forEach((week, index) => {

                            const illusionEvent = {...event};
                            illusionEvent.illusionStart = moment(week.day(this.calendar.weekStartDay));
                            illusionEvent.illusionEnd = illusionEvent.end.isAfter(week, 'weeks') ? moment(week.day(this.calendar.weekDaysCount)) : moment(event.end);
                            event.illusions.push(illusionEvent);
                        });

                } else {
                    const day = this.monthGrid[this.weeksIndices[event.start.week()]][this.daysIndices[`${event.start.month()}${event.start.date()}`]];

                    if (!day) return;

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
    public setEventStyle(event) {

        if (event.sequence >= this.maxEventsPerDay) {
            event.style = {display: 'none'};
            return;
        }
        const eventStart = moment(event.illusionStart || event.start);
        const eventEnd = moment(event.illusionEnd || event.end);
        const weekI = this.weeksIndices[eventStart.week()];
        const startDate = eventStart.isBefore(this.monthGrid[weekI][0].date, 'days') ? this.monthGrid[weekI][0].date : eventStart;
        const endDate = eventEnd.isAfter(this.monthGrid[weekI][this.monthGrid[weekI].length - 1].date, 'days') ? this.monthGrid[weekI][this.monthGrid[weekI].length - 1].date : eventEnd;
        // reset the start date
        startDate.set({hour: 0, minute: 0, second: 0});
        const length = endDate.diff(startDate, 'day') + 1;
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
}
