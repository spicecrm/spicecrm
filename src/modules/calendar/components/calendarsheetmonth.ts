import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
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

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar-sheet-month',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonth.html',
})
export class CalendarSheetMonth implements OnChanges, AfterViewInit {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @ViewChild('daycontainer', {read: ViewContainerRef}) private dayContainer: ViewContainerRef;
    @ViewChild('boxcontainer', {read: ViewContainerRef}) private boxContainer: ViewContainerRef;
    @ViewChild('morecontainer', {read: ViewContainerRef}) private moreContainer: ViewContainerRef;

    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('googlecalendarvisible') private googleCalendarVisible: boolean = true;
    @Input() private setdate: any = {};

    private currentGrid: Array<any> = [];
    private eventHeight: number = 25;
    private moreHeight: number = 20;
    private maxEventsPerBox: number = 1;
    private resizeHandler: any = {};
    private ownerEvents: Array<any> = [];
    private otherEvents: Array<any> = [];
    private googleEvents: Array<any> = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private renderer: Renderer2,
                private calendar: calendar) {
        this.resizeHandler = this.renderer.listen('window', 'resize', () => this.setMaxEvents());
    }

    get allEvents() {
        return this.ownerEvents.concat(this.otherEvents, this.googleEvents);
    }

    public ngAfterViewInit() {
        this.setMaxEvents();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.buildGrid();
            this.getEvents();
            this.getUsersEvents();
            this.getGoogleEvents(true);
        }
        if (changes.usersCalendars) {
            this.getUsersEvents();
        }
        if (changes.googleCalendarVisible) {
            this.getGoogleEvents();
        }
    }

    private setMaxEvents() {
        let boxContainerHeight = this.boxContainer.element.nativeElement.clientHeight;
        let dayContainerHeight = this.dayContainer.element.nativeElement.clientHeight;
        this.maxEventsPerBox = Math.floor((boxContainerHeight - dayContainerHeight - this.moreHeight) / this.eventHeight);
    }

    private getSheetDays(): Array<any> {
        let sheetDays = [];
        // build the days
        let i = 0;
        let dayIndex = this.calendar.weekStartDay;
        let days = moment.weekdaysShort();
        while (i < this.calendar.weekDaysCount) {
            sheetDays.push({
                index: i,
                text: days[dayIndex]
            });
            i++;
            dayIndex++;
            if (dayIndex > 6) {
                dayIndex = 0;
            }
        }
        return sheetDays;
    };

    private getEvents() {
        let startDate = new moment(this.setdate).date(1).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M')).hour(this.calendar.endHour);
        this.ownerEvents = [];

        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                events.forEach(event => {
                    if (event.type == "absence") {
                        event.end = event.end.add(1, 'h');
                    }
                });
                this.ownerEvents = events;
                this.reArrangeEvents(this.ownerEvents, "owner");
            }
        });
    }

    private getGoogleEvents(reload = false) {
        if (!this.calendar.loggedByGoogle) {
            return;
        }
        let startDate = new moment(this.setdate).date(1).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M')).hour(this.calendar.endHour);
        let params = {
            startdate: startDate.format('YYYY-MM-DD HH:mm:ss'),
            enddate: endDate.format('YYYY-MM-DD HH:mm:ss')
        };
        this.googleEvents = [];

        if (reload) {
            this.backend.getRequest("google/calendar/getgoogleevents", params).subscribe(res => {
                if (res.events && res.events.length > 0) {
                    let events = res.events.map(event => {
                        event.start = moment(event.start.dateTime).tz(moment.tz.guess()).add(moment().utcOffset(), 'm');
                        event.end = moment(event.end.dateTime).tz(moment.tz.guess()).add(moment().utcOffset(), 'm');
                        if (+event.end.diff(event.start, 'days') > 0) {
                            event.isMulti = true;
                        }
                        event.data = {};
                        event.data.summary_text = event.summary;
                        event.data.assigned_user_id = null;
                        event.color = "#db4437";
                        event.visible = this.googleCalendarVisible;
                        return event;
                    });
                    this.calendar.calendars["google"] = events;
                    this.googleEvents = events;
                    this.reArrangeEvents(this.googleEvents, "google");
                    this.googleEvents = events.filter(event => event.visible);

                }
            });
        } else {
            let events = this.calendar.calendars["google"];
            if (events) {
                events = events.map(event => {
                    event.visible = this.googleCalendarVisible;
                    return event;
                });
                this.googleEvents = events.filter(event => event.start < endDate && event.end > startDate);
                this.reArrangeEvents(this.googleEvents, "google");
                this.googleEvents = events.filter(event => event.visible);
            }
        }
    }

    private getUsersEvents() {
        let startDate = new moment(this.setdate).date(1).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M')).hour(this.calendar.endHour);
        this.currentGrid.forEach(week => week.forEach(day => day.items = day.items.filter(item => item.category != "users")));
        this.otherEvents = [];
        for (let calendar of this.calendar.usersCalendars) {
            this.calendar.loadEvents(startDate, endDate, calendar.id).subscribe(events => {
                if (events.length > 0) {
                    events.forEach(event => {
                        event.color = calendar.color;
                        event.visible = calendar.visible;
                        this.otherEvents.push(event);
                    });
                    this.reArrangeEvents(this.otherEvents, "users");
                    this.otherEvents = this.otherEvents.filter(event => event.visible);
                }
            });
        }
    }

    private reArrangeEvents(events, category) {
        for (let w = 0; w < this.currentGrid.length; w++) {
            for (let event of events) {
                if (!event.hasOwnProperty("weeksI")) {
                    event.weeksI = [];
                }
                for (let d = 0; d < this.currentGrid[w].length; d++) {
                    let day = this.currentGrid[w][d];
                    for (let eventDay = moment(event.start); eventDay.isBefore(event.end); eventDay.add(1, 'days')) {
                        if (eventDay.date() == day.day && day.month == eventDay.month()) {
                            if (!event.hasOwnProperty("startI")) {
                                event.startI = d;
                            }
                            if (!day.items.some(itemsEvent => itemsEvent.id == event.id)) {
                                event.category = category;
                                day.items.push(event);
                            }
                            if (event.weeksI.indexOf(w) == -1) {
                                event.weeksI.push(w);
                            }
                            event.endI = d;
                        }
                    }
                    day.items.sort((a, b) => {
                        if (a.start < b.start || a.data.duration_hours > b.data.duration_hours) {
                            return -1;
                        }
                        if (a.data.duration_hours <= 24) {
                            return 1;
                        }
                        return 0;
                    });
                    day.items = day.items.filter(event => (event.hasOwnProperty("visible") && event.visible) || !event.hasOwnProperty("visible"));
                }
            }
        }
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
        return {
            width: `calc(100% / ${this.calendar.weekDaysCount})`,
            color: calendarDate.year() == todayDay.year() && calendarDate.month() == todayDay.month() && todayDayShort == weekdayShort ? this.calendar.todayColor : 'inherit',
            'font-weight': calendarDate.year() == todayDay.year() && calendarDate.month() == todayDay.month() && todayDayShort == weekdayShort ? '600' : 'inherit'
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
        // move to first day of month
        fdom.date(1);
        // move to Sunday
        fdom.day(this.calendar.weekStartDay);
        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = [];
            if ((fdom.year() < this.setdate.year()) || (fdom.month() <= this.setdate.month())) {
                while (i < this.calendar.weekDaysCount) {
                    week.push({day: fdom.date(), month: fdom.month(), items: []});
                    let weekDaysOffset = 7 - this.calendar.weekDaysCount;
                    if (i == (this.calendar.weekDaysCount - 1) && this.calendar.weekDaysCount < 7) {
                        fdom.add(weekDaysOffset, 'd');
                    }
                    fdom.add(1, 'd');
                    i++;
                }
                this.currentGrid.push(week);
            }
            j++;
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
        let endI = 0;
        let startI = null;
        let eventI = 0;
        let visible = "block";
        this.currentGrid[weekI].some((day, dIndex) => {
            if (day.items.indexOf(event) > -1) {
                if (startI == null) {
                    startI = dIndex;
                }
                endI = dIndex;
                eventI = eventI > day.items.indexOf(event) ? eventI : day.items.indexOf(event);
                if (eventI >= this.maxEventsPerBox) {
                    visible = "none";
                }
            }
        });
        let duration = endI - startI;
        let sheetContainer = this.calendarsheet.element.nativeElement;
        let dayContainerHeight = this.dayContainer != undefined ? this.dayContainer.element.nativeElement.clientHeight : 0;

        return {
            left: (sheetContainer.clientWidth / this.calendar.weekDaysCount) * startI,
            width: (sheetContainer.clientWidth / this.calendar.weekDaysCount) + ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * duration),
            top: dayContainerHeight + ((sheetContainer.clientHeight / this.currentGrid.length) * weekI) + (this.eventHeight * eventI),
            height: this.eventHeight,
            display: visible
        };
    }

    private isTodayStyle(day, month) {
        let year = this.calendar.calendarDate.year();
        let today = new moment();
        return {
            'background-color': year === today.year() && today.month() === month && today.date() == day ? this.calendar.todayColor : 'inherit',
            'border-radius': '50%',
            'line-height': '1rem',
            'text-align': 'center',
            'font-size': '.7rem',
            color: year === today.year() && today.month() === month && today.date() == day ? '#fff' : 'inherit',
            width: '1rem',
            height: '1rem',
            display: 'block',
        };
    }
}
