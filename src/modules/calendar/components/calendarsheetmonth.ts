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
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('googlecalendarvisible') private googleCalendarVisible: boolean = true;
    @Input() private setdate: any = {};
    private currentGrid: Array<any> = [];
    private eventHeight: number = 25;
    private maxEventsPerBox: number = 1;
    private resizseHandler: any = {};
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
        this.resizseHandler = this.renderer.listen('window', 'resize', () => this.setMaxEvents());
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
            this.showHideGoogleEvents();
        }
    }

    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.otherEvents, this.googleEvents));
    }

    private showHideGoogleEvents() {
        this.googleEvents = this.googleEvents.map(event => {
            event.visible = this.googleCalendarVisible;
            return event;
        });
    }

    private setMaxEvents() {
        let boxContainerHeight =  this.boxContainer.element.nativeElement.clientHeight;
        let dayContainerHeight = this.dayContainer.element.nativeElement.clientHeight;
        this.maxEventsPerBox = Math.floor((boxContainerHeight - dayContainerHeight) / this.eventHeight);
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
            if (dayIndex > 6) {dayIndex = 0}
        }
        return sheetDays;
    };

    private getEvents() {
        let startDate = new moment(this.setdate).date(1).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M')).hour(this.calendar.endHour);
        this.ownerEvents = [];

        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                this.ownerEvents = events;
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
                    this.googleEvents = events.filter(event => !event.isMulti && event.visible);
                }
            });
        } else {
            let events = this.calendar.calendars["google"];
            if (events) {
                events = events.map(event => {
                    event.visible = this.googleCalendarVisible;
                    return event;
                });
                this.googleEvents = events.filter(event => event.visible && event.start < endDate && event.end > startDate);
            }
        }
    }

    private getUsersEvents() {
        let startDate = new moment(this.setdate).date(1).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M')).hour(this.calendar.endHour);
        this.otherEvents = [];
        for (let calendar of this.calendar.usersCalendars) {
            this.calendar.loadEvents(startDate, endDate, calendar.id).subscribe(events => {
                if (events.length > 0) {
                    events = events.map(event => {
                        event.color = calendar.color;
                        event.visible = calendar.visible;
                        return event;
                    });
                    this.otherEvents = events;
                }
            });
        }

    }

    // private groupEventsByWeek(events) {
    //     for (let event of events) {
    //         for (let w = 0; w < this.currentGrid.length; w++) {
    //             for (let d = 0; d < this.currentGrid[w].length; d++) {
    //                 if (this.startEndThisMonth(event) || this.endThisMonth(event) || this.startThisMonth(event)) {
    //                     if (!this.calendarevents[w]) { this.calendarevents[w] = []}
    //                     if (this.calendarevents[w].indexOf(event) == -1){this.calendarevents[w].push(event)}
    //                     this.setEventIndices(event, this.calendarevents[w][d], d);
    //                 }
    //             }
    //         }
    //     }
    // }

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
                    if (i == (this.calendar.weekDaysCount - 1) && this.calendar.weekDaysCount < 7) {fdom.add(weekDaysOffset, 'd')}
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

    private startEndThisMonth(event) {
        let thisMonth = new moment(this.setdate).month();
        return (event.start.month() === thisMonth && event.end.month() === thisMonth);
    }

    private endThisMonth(event) {
        let thisMonth = new moment(this.setdate).month();
        return (event.start.month() < thisMonth && event.end.month() === thisMonth);
    }

    private startThisMonth(event) {
        let thisMonth = new moment(this.setdate).month();
        return (event.end.month() > thisMonth && event.start.month() === thisMonth);
    }

    private setEventIndices(event, day, DIndex) {
        if (day.items.indexOf(event.id) == -1) {day.items.push(event.id)}
        if (event.dayStartIndex == undefined) {event.dayStartIndex = DIndex}
        event.dayEndIndex = DIndex;
        event.eventIndex = event.eventIndex > day.items.indexOf(event.id) ? event.eventIndex : day.items.indexOf(event.id);
        if (event.id == "8e8c20c9-3fce-0a62-c28e-9b5627418862") {
            console.log(event.dayEndIndex)
        }
    }

    private getEventStyle(event, weekIndex) {
        let sheetContainer = this.calendarsheet.element.nativeElement;
        let dayContainerHeight = this.dayContainer != undefined ? this.dayContainer.element.nativeElement.clientHeight : 0;

        return {
            left: (sheetContainer.clientWidth / this.calendar.weekDaysCount) * event.dayStartIndex,
            width: (sheetContainer.clientWidth / this.calendar.weekDaysCount) + ((sheetContainer.clientWidth / this.calendar.weekDaysCount) * (event.dayEndIndex - event.dayStartIndex)),
            top: dayContainerHeight + ((sheetContainer.clientHeight / this.currentGrid.length) * weekIndex) + (event.eventIndex * this.eventHeight),
            height: this.eventHeight
        }
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
        }
    }
}
