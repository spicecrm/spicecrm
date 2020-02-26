/**
 * @module ModuleCalendar
 */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
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

@Component({
    selector: 'calendar-sheet-month',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonth.html',
})
export class CalendarSheetMonth implements OnChanges, AfterViewInit, OnDestroy {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef, static: true}) private calendarsheet: ViewContainerRef;
    @Input() private setdate: any = {};
    @Input('googleisvisible') private googleIsVisible: boolean = true;
    private currentGrid: any[] = [];
    private offsetHeight: number = 20;
    private ownerEvents: any[] = [];
    private userEvents: any[] = [];
    private googleEvents: any[] = [];
    private subscription: Subscription = new Subscription();


    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private renderer: Renderer2,
                private cdr: ChangeDetectorRef,
                private calendar: calendar) {
        this.subscription.add(this.calendar.userCalendarChange$.subscribe(calendar => {
                this.getUserEvents(calendar);
            })
        );
        this.subscription.add(this.calendar.usersCalendarsLoad$.subscribe(() => {
                this.getUsersEvents();
            })
        );
    }

    get allEvents() {
        return this.ownerEvents.concat(this.userEvents, this.googleEvents);
    }

    get eventHeight() {
        return !this.calendar.isMobileView ? 25 : 20;
    }

    get maxEventsPerBox() {
        let boxContainerHeight = this.calendarsheet ? this.calendarsheet.element.nativeElement.clientHeight / this.currentGrid.length : undefined;
        return boxContainerHeight ? Math.floor((boxContainerHeight - (this.offsetHeight * 2)) / this.eventHeight) : 1;
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.buildGrid();
        if (changes.setdate) {
            this.getEvents();
            if (this.calendar.usersCalendarsLoaded) {
                this.getUsersEvents();
            }
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    public ngOnDestroy() {
        this.cdr.detach();
        this.subscription.unsubscribe();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private trackByFnDate(index, item) {
        return index;
    }

    private startDate() {
        return new moment(this.setdate).date(1).hour(0).minute(0).second(0);
    }

    private endDate() {
        return new moment(this.startDate()).endOf('month');
    }

    private getSheetDays(): any[] {
        let sheetDays = [];
        let i = 0;
        let dayIndex = this.calendar.weekStartDay;
        let days = moment.weekdaysShort();
        while (i < this.calendar.weekDaysCount) {
            sheetDays.push({index: i, text: days[dayIndex]});
            i++;
            dayIndex++;
            if (dayIndex > 6) {
                dayIndex = 0;
            }
        }
        return sheetDays;
    }

    private getEvents() {
        this.ownerEvents = [];
        this.arrangeEvents();

        this.calendar.loadEvents(this.startDate(), this.endDate())
            .subscribe(events => {
                if (events.length > 0) {
                    this.ownerEvents = events;
                    this.arrangeEvents();
                }
            });
    }

    private getGoogleEvents() {
        this.googleEvents = [];
        this.arrangeEvents();
        if (!this.googleIsVisible || this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadGoogleEvents(this.startDate(), this.endDate())
            .subscribe(events => {
                if (events.length > 0) {
                    this.googleEvents = events;
                    this.arrangeEvents();
                }
            });
    }

    private getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id);
        this.arrangeEvents();
        if (this.calendar.isMobileView || !calendar.visible) {
            return;
        }

        this.calendar.loadUserEvents(this.startDate(), this.endDate(), calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.arrangeEvents();
                }
            });
    }

    private getUsersEvents() {
        this.userEvents = [];
        this.arrangeEvents();
        if (this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadUsersEvents(this.startDate(), this.endDate())
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.arrangeEvents();
                }
            });
    }

    private arrangeEvents() {
        for (let w = 0; w < this.currentGrid.length; w++) {
            this.currentGrid[w].forEach(day => day.events = []);
            for (let event of this.allEvents) {
                if (!event.hasOwnProperty("weeksI")) {
                    event.weeksI = [];
                }
                // tslint:disable-next-line:prefer-for-of
                for (let d = 0; d < this.currentGrid[w].length; d++) {
                    let day = this.currentGrid[w][d];
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
                this.currentGrid[w].forEach(day => {
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

    private gotoDay(sheetday) {
        let navigateDate = moment(this.setdate);
        navigateDate.month(sheetday.month).date(sheetday.day);
        this.navigateday.emit(navigateDate);
    }

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

    private getDayDividerStyle(day) {
        return {
            left: (this.calendarsheet.element.nativeElement.clientWidth / this.calendar.weekDaysCount * day) + 'px',
            top: '0px',
            height: '100%'
        };
    }

    private buildGrid() {
        this.currentGrid = [];
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
                this.currentGrid.push(week);
            }
            w++;
        }
    }

    private notLastWeek(week) {
        return week < this.currentGrid.length;
    }

    private notThisMonth(month) {
        return month !== this.setdate.month();
    }

    private getWeekDividerStyle(week) {
        return {
            top: 'calc((100% / ' + this.currentGrid.length + ') * ' + week + ' )'
        };
    }

    private getBoxStyle(i, j, month) {
        return {
            'left': (this.calendarsheet.element.nativeElement.clientWidth / this.calendar.weekDaysCount * j) + 'px',
            'top': 'calc((100% / ' + this.currentGrid.length + ') * ' + i + ' )',
            'color': this.notThisMonth(month) ? '#9faab5' : 'inherit',
            'background-color': this.notThisMonth(month) ? '#f4f6f9' : 'transparent',
            'width': (this.calendarsheet.element.nativeElement.clientWidth / this.calendar.weekDaysCount) + 'px',
            'height': 'calc(100% / ' + this.currentGrid.length + ')',
        };
    }

    private getEventStyle(event, weekI) {
        let startI = null;
        let eventI = null;
        let endI = 0;
        let eDays = 0;
        let visible = "block";
        let sheetContainer = this.calendarsheet.element.nativeElement;

        this.currentGrid[weekI].forEach((day, dIndex) => {
            if (day.events.indexOf(event) > -1) {
                eDays++;
                startI = startI == null ? dIndex : startI;
                endI = dIndex;
                if (!eventI) eventI = day.events.indexOf(event);
                visible = eventI >= this.maxEventsPerBox ? "none" : visible;
            }
        });

        return {
            left: ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * startI) + 'px',
            width: ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * eDays) + 'px',
            top: (this.offsetHeight + ((sheetContainer.clientHeight / this.currentGrid.length) * weekI) + (this.eventHeight * eventI)) + 'px',
            height: this.eventHeight + 'px',
            display: visible
        };
    }

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
