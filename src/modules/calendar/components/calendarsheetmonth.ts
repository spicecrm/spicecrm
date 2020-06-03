/**
 * @module ModuleCalendar
 */
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
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
    private monthGrid: any[] = [];
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
     * subscription to handle unsubscribe
     */
    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private renderer: Renderer2,
                private cdr: ChangeDetectorRef,
                private calendar: calendar) {
        this.buildSheetDays();
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
     * @return allEvents: [ownerEvents, userEvents, googleEvents]
     */
    get allEvents() {
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
        this.cdr.detectChanges();
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
    public ngOnDestroy() {
        this.cdr.detach();
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
        this.arrangeEvents();

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.ownerEvents = events;
                    this.arrangeEvents();
                }
            });
    }

    /**
     * load google events from service and rearrange the multi events
     */
    private getGoogleEvents() {
        this.googleEvents = [];
        this.arrangeEvents();
        if (!this.googleIsVisible || this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadGoogleEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.googleEvents = events;
                    this.arrangeEvents();
                }
            });
    }

    private getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.arrangeEvents();
        if (this.calendar.isMobileView || !calendar.visible) {
            return;
        }

        this.calendar.loadUserEvents(this.startDate, this.endDate, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.arrangeEvents();
                }
            });
    }

    /**
     * load other user events from service and rearrange the multi events
     */
    private getUsersEvents() {
        this.userEvents = [];
        this.arrangeEvents();
        if (this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadUsersEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.arrangeEvents();
                }
            });
    }

    /**
     * arrange events by duration
     */
    private arrangeEvents() {
        for (let w = 0; w < this.monthGrid.length; w++) {
            this.monthGrid[w].forEach(day => day.events = []);
            for (let event of this.allEvents) {
                if (!event.hasOwnProperty("weeksI")) {
                    event.weeksI = [];
                }
                // tslint:disable-next-line:prefer-for-of
                for (let d = 0; d < this.monthGrid[w].length; d++) {
                    let day = this.monthGrid[w][d];
                    for (let eventDay = moment(event.start); eventDay.diff(event.end) <= 0; eventDay.add(1, 'days')) {
                        if (eventDay.date() == day.day && day.month == eventDay.month()) {

                            if (!day.events.some(itemsEvent => itemsEvent.id == event.id)) {
                                day.events.push(event);
                            }
                            if (event.weeksI.indexOf(w) == -1) {
                                event.weeksI.push(w);
                            }
                        }
                    }
                    day.events = day.events.filter(event => (event.hasOwnProperty("visible") && event.visible) || !event.hasOwnProperty("visible"));
                    day.events.sort((a, b) => a.start.isSame(b.start, 'day') && (a.start.isAfter(b.start, 'hour') || (a.start.isSame(b.start, 'hour') && a.start.isAfter(b.start, 'minute'))) ? 1 : -1);
                }
            }
            this.allEvents.forEach(event => {
                let itemIdx = null;
                this.monthGrid[w].forEach(day => {
                    day.events.forEach((item, idx) => {
                        if (item.id == event.id) {
                            if (itemIdx != null && event.end.diff(event.start, 'days') > 0) {
                                day.events.splice(idx, 1);
                                day.events.splice(itemIdx, 0, event);
                            } else {
                                itemIdx = idx;
                            }
                        }
                    });
                });
            });
        }

        return this.allEvents;
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
        let fdom = new moment(this.setdate);
        fdom.date(1);
        fdom.day(this.calendar.weekStartDay);
        let w = 0;
        while (w < 6) {
            let d = 0;
            let week = [];
            if ((fdom.year() < this.setdate.year()) || (fdom.month() <= this.setdate.month())) {
                while (d < this.calendar.weekDaysCount) {
                    week.push({day: fdom.date(), month: fdom.month(), items: []});
                    let weekDaysOffset = 7 - this.calendar.weekDaysCount;
                    if (d == (this.calendar.weekDaysCount - 1) && this.calendar.weekDaysCount < 7) {
                        fdom.add(weekDaysOffset, 'd');
                    }
                    fdom.add(1, 'd');
                    d++;
                }
                this.monthGrid.push(week);
            }
            w++;
        }
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
        };
    }

    /**
     * set event style
     * @param event
     * @param weekI
     */
    private setEventStyle(event, weekI) {
        let startI = null;
        let eventI = null;
        let endI = 0;
        let eDays = 0;
        let visible = "block";
        let sheetContainer = this.sheetContainer.element.nativeElement;

        this.monthGrid[weekI].forEach((day, dIndex) => {
            if (day.events.indexOf(event) > -1) {
                eDays++;
                startI = startI == null ? dIndex : startI;
                endI = dIndex;
                if (!eventI) eventI = day.events.indexOf(event);
                visible = eventI >= this.maxEventsPerDay ? "none" : visible;
            }
        });

        event.style = {
            left: ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * startI) + 'px',
            width: ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * eDays) + 'px',
            top: (this.offsetHeight + ((sheetContainer.clientHeight / this.monthGrid.length) * weekI) + (this.eventHeight * eventI)) + 'px',
            height: this.eventHeight + 'px',
            display: visible
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
