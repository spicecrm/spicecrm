import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    ChangeDetectorRef,
    Output,
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

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar-sheet-month',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonth.html',
})
export class CalendarSheetMonth implements OnChanges, AfterViewInit, OnDestroy {

    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @ViewChild('boxcontainer', {read: ViewContainerRef}) private boxContainer: ViewContainerRef;
    @ViewChild('morecontainer', {read: ViewContainerRef}) private moreContainer: ViewContainerRef;

    @Input() private setdate: any = {};
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('othercalendars') private otherCalendars: any[] = [];
    @Input('googleisvisible') private googleIsVisible: boolean = true;
    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();

    private currentGrid: any[] = [];
    private eventHeight: number = 25;
    private offsetHeight: number = 20;
    private maxEventsPerBox: number = 1;
    private resizeHandler: any = {};
    private ownerEvents: any[] = [];
    private otherEvents: any[] = [];
    private userEvents: any[] = [];
    private googleEvents: any[] = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private renderer: Renderer2,
                private cdr: ChangeDetectorRef,
                private calendar: calendar) {
        this.resizeHandler = this.renderer.listen('window', 'resize', () => this.setMaxEvents());
    }

    getAllEvents() {
        return this.arrangeEvents(this.ownerEvents.concat(this.userEvents, this.otherEvents, this.googleEvents));
    }

    get startDate() {
        return new moment(this.setdate).date(1).hour(0).minute(0).second(0);
    }

    get endDate() {
        return new moment(this.startDate).endOf('month');
    }

    public ngAfterViewInit() {
        this.setMaxEvents();
        this.cdr.detectChanges();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.buildGrid();
        if (changes.setdate) {
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

    private setMaxEvents() {
        let boxContainerHeight = this.boxContainer.element.nativeElement.clientHeight;
        this.maxEventsPerBox = Math.floor((boxContainerHeight - (this.offsetHeight * 2)) / this.eventHeight);
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
        this.calendar.loadEvents(this.startDate, this.endDate).subscribe(events => {
            if (events.length > 0) {
                events.forEach(event => {
                    event.start = this.resetTime(event.start);
                    event.end = this.resetTime(event.end);
                });
                this.ownerEvents = events;
            }
        });
    }

    private getGoogleEvents() {
        this.googleEvents = [];
        if (!this.googleIsVisible) {return}
            this.calendar.loadGoogleEvents("Month", this.startDate, this.endDate).subscribe(events => {
            if (events.length > 0) {
                events = events.map(event => {
                    event.start = this.resetTime(event.start);
                    event.end = this.resetTime(event.end);
                    return event;
                });
                this.googleEvents = events;
            }
        });
    }

    private getUsersEvents() {
        this.userEvents = [];
        for (let calendar of this.calendar.usersCalendars) {
            if (!calendar.visible) {continue}
            this.calendar.loadEvents(this.startDate, this.endDate, calendar.id).subscribe(events => {
                if (events.length > 0) {
                    events.forEach(event => {
                        event.color = calendar.color;
                        event.visible = calendar.visible;
                        event.start = this.resetTime(event.start);
                        event.end = this.resetTime(event.end);
                        this.userEvents.push(event);
                    });
                }
            });
        }
    }

    private getOtherEvents() {
        this.otherEvents = [];
        for (let calendar of this.calendar.otherCalendars) {
            if (!calendar.visible) {continue}
            this.calendar.loadEvents(this.startDate, this.endDate, calendar.id, true).subscribe(events => {
                if (events.length > 0) {
                    events.forEach(event => {
                        event.color = calendar.color;
                        event.visible = calendar.visible;
                        event.start = this.resetTime(event.start);
                        event.end = this.resetTime(event.end);
                        this.otherEvents.push(event);
                    });
                }
            });
        }
    }

    private resetTime(event) {
        event = moment(event.hour(0).minute(0).second(0)).format('YYYY-MM-DD HH:mm:ss');
        return moment(event);
    }

    private arrangeEvents(events) {
        for (let w = 0; w < this.currentGrid.length; w++) {
            this.currentGrid[w].forEach(day => day.items = []);
            for (let event of events) {
                if (!event.hasOwnProperty("weeksI")) {
                    event.weeksI = [];
                }
                for (let d = 0; d < this.currentGrid[w].length; d++) {
                    let day = this.currentGrid[w][d];
                    for (let eventDay = moment(event.start); eventDay.diff(event.end) <= 0; eventDay.add(1, 'days')) {
                        if (eventDay.date() == day.day && day.month == eventDay.month()) {

                            if (!day.items.some(itemsEvent => itemsEvent.id == event.id)) {
                                day.items.push(event);
                            }
                            if (event.weeksI.indexOf(w) == -1) {
                                event.weeksI.push(w);
                            }
                        }
                    }
                    day.items = day.items.filter(event => (event.hasOwnProperty("visible") && event.visible) || !event.hasOwnProperty("visible"));
                    day.items.sort((a, b) => {
                        if (a.start.isBefore(b.start)) {
                            return -1;
                        } else if (a.start.diff(a.end, 'days') < b.start.diff(b.end, 'days')) {
                            return -1;
                        }
                        return 0;
                    });
                }
            }
            events.forEach(event => {
                let itemIdx = null;
                this.currentGrid[w].forEach(day => {
                    day.items.forEach((item, idx) => {
                        if (item.id == event.id) {
                            if (itemIdx != null && event.end.diff(event.start, 'days') > 0) {
                                day.items.splice(idx, 1);
                                day.items.splice(itemIdx, 0, event);
                            } else {
                                itemIdx = idx;
                            }
                        }
                    });
                });
            });
        }

        return events;
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
            width: `calc(100% / ${this.calendar.weekDaysCount})`,
            color: isToday ? this.calendar.todayColor : 'inherit',
            'font-weight': isToday ? '600' : 'inherit'
        };
    }

    private getSheetStyle() {
        return {
            height: 'calc(100vh - ' + (this.calendarsheet.element.nativeElement.offsetTop + 20) + 'px)',
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
    };

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
            left: (this.calendarsheet.element.nativeElement.clientWidth / this.calendar.weekDaysCount * j) + 'px',
            top: 'calc((100% / ' + this.currentGrid.length + ') * ' + i + ' )',
            color: this.notThisMonth(month) ? '#9faab5' : 'inherit',
            'background-color': this.notThisMonth(month) ? '#f4f6f9' : 'transparent',
            width: (this.calendarsheet.element.nativeElement.clientWidth / this.calendar.weekDaysCount) + 'px',
            height: 'calc(100% / ' + this.currentGrid.length + ')',
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
            if (day.items.indexOf(event) > -1) {
                eDays++;
                startI = startI == null ? dIndex : startI;
                endI = dIndex;
                eventI = eventI == null ? day.items.indexOf(event) : eventI;
                visible = eventI >= this.maxEventsPerBox ? "none" : visible;
            }
        });

        return {
            left: (sheetContainer.clientWidth / this.calendar.weekDaysCount) * startI,
            width: (sheetContainer.clientWidth / this.calendar.weekDaysCount) * eDays,
            top: this.offsetHeight + ((sheetContainer.clientHeight / this.currentGrid.length) * weekI) + (this.eventHeight * eventI),
            height: this.eventHeight,
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
            'font-size': '.7rem',
            width: '1rem',
            height: '1rem',
            display: 'block',
            color: isToday ? '#fff' : 'inherit',
            'background-color': isToday ? this.calendar.todayColor : 'inherit',
        };
    }

    ngOnDestroy() {
        this.cdr.detach();
    }
}
