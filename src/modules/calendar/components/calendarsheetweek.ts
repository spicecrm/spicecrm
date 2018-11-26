import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';
import {backend} from "../../../services/backend.service";

declare var moment: any;

@Component({
    selector: 'calendar-sheet-week',
    templateUrl: './src/modules/calendar/templates/calendarsheetweek.html',
})
export class CalendarSheetWeek implements OnChanges, AfterViewInit {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    public sheetDays: Array<any> = [];
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @ViewChild('multievents', {read: ViewContainerRef}) private multiEvents: ViewContainerRef;
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('googlecalendarvisible') private googleCalendarVisible: boolean = true;
    @Input() private setdate: any = {};
    private sheetTimeWidth: number = 80;
    private sheetHours: Array<any> = [];
    private sheetTopMargin: number = 0;
    private ownerEvents: Array<any> = [];
    private ownerMultiEvents: Array<any> = [];
    private otherEvents: Array<any> = [];
    private otherMultiEvents: Array<any> = [];
    private googleEvents: Array<any> = [];
    private googleMultiEvents: Array<any> = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private calendar: calendar) {
        this.buildHours();
        this.sheetDays = this.buildSheetDays();
    }

    get offset() {
        return moment().utcOffset();
    }

    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.otherEvents, this.googleEvents));
    }

    get allMultiEvents() {
        return this.ownerMultiEvents.concat(this.otherMultiEvents, this.googleMultiEvents);
    }

    public ngAfterViewInit() {
        this.calendarsheet.element.nativeElement.scrollTop = 8 * this.calendar.sheetHourHeight;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.sheetDays = this.buildSheetDays();
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

    private getEvents() {
        let startDate = new moment(this.setdate).day(0).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(this.calendar.weekDaysCount, 'd')).hour(this.calendar.endHour);
        this.ownerEvents = [];
        this.ownerMultiEvents = [];

        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                events = events.filter(event => event.start.hour() >= this.calendar.startHour && event.end.hour() <= this.calendar.endHour || event.type == "absence");
                this.ownerEvents = events.filter(event => !event.isMulti);
                this.ownerMultiEvents = events.filter(event => event.isMulti);
                this.ownerMultiEvents.sort((a, b) => {
                    if (a.type == "absence") {
                        return -1;
                    }
                    return 0;
                });
            }
        });
    }

    private getGoogleEvents(reload = false) {
        if (!this.calendar.loggedByGoogle) {
            return;
        }
        let startDate = new moment(this.setdate).day(0).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(this.calendar.weekDaysCount, 'd')).hour(this.calendar.endHour);
        let params = {
            startdate: startDate.format('YYYY-MM-DD HH:mm:ss'),
            enddate: endDate.format('YYYY-MM-DD HH:mm:ss')
        };
        this.googleEvents = [];
        this.googleMultiEvents = [];

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
                    events = events.filter(event => event.start.hour() >= this.calendar.startHour && event.end.hour() <= this.calendar.endHour);
                    this.calendar.calendars["google"] = events;
                    this.googleEvents = events.filter(event => !event.isMulti && event.visible);
                    this.googleMultiEvents = events.filter(event => event.isMulti && event.visible);
                }
            });
        } else {
            let events = this.calendar.calendars["google"];
            if (events) {
                events = events.map(event => {
                    event.visible = this.googleCalendarVisible;
                    return event;
                });
                this.googleEvents = events.filter(event => !event.isMulti && event.visible && event.start < endDate && event.end > startDate);
                this.googleMultiEvents = events.filter(event => event.isMulti && event.visible && event.start < endDate && event.end > startDate);
            }
        }
    }

    private getUsersEvents() {
        let startDate = new moment(this.setdate).day(0).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(this.calendar.weekDaysCount, 'd')).hour(this.calendar.endHour);
        this.otherEvents = [];
        this.otherMultiEvents = [];
        for (let calendar of this.calendar.usersCalendars) {
            this.calendar.loadEvents(startDate, endDate, calendar.id).subscribe(events => {
                if (events.length > 0) {
                    events = events.filter(event => event.start.hour() >= this.calendar.startHour && event.end.hour() <= this.calendar.endHour);
                    events.forEach(event => {
                        event.color = calendar.color;
                        event.visible = calendar.visible;
                        if (!event.isMulti) {
                            this.otherEvents.push(event);
                        } else {
                            this.otherMultiEvents.push(event);
                        }
                    });
                    this.otherEvents = this.otherEvents.filter(event => event.visible);
                    this.otherMultiEvents = this.otherMultiEvents.filter(event => event.visible);
                }
            });
        }

    }

    // get sheetDays(): Array<any> {
    private buildSheetDays() {
        let sheetDays = [];

        // build the days
        let i = 0;
        let dayIndex = this.calendar.weekStartDay;
        while (i < this.calendar.weekDaysCount) {
            let focDate = new moment(this.setdate);
            focDate.day(dayIndex);
            sheetDays.push({
                index: i,
                date: focDate
            });
            i++;
            dayIndex++;
        }
        return sheetDays;
    };

    private isTodayStyle(date) {
        let today = new moment();
        return {
            color: today.year() === date.year() && today.month() === date.month() && today.date() == date.date() ? this.calendar.todayColor : 'inherit'
        };
    }

    private getEventStyle(event) {
        // get the day of the week
        let startday = event.start.day() - this.calendar.weekStartDay;
        let startminutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
        let endminutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();

        let itemWidth = ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount) / (event.maxOverlay > 0 ? event.maxOverlay : 1);

        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount * startday) + (itemWidth * event.displayIndex) + 'px',
            width: itemWidth + 'px',
            top: this.calendar.sheetHourHeight / 60 * startminutes + 'px',
            height: this.calendar.sheetHourHeight / 60 * (endminutes - startminutes) + 'px',
            'z-index': event.resizing ? 20 : 15,
            'border-bottom': event.resizing ? '1px dotted #fff' : 0
        };
    }

    private getMultiEventStyle(event, eventIndex): any {
        if (!this.multiEvents) {
            return {};
        }
        let multiEvents = this.multiEvents.element.nativeElement.getBoundingClientRect();
        let startDate = new moment(this.setdate).day(0).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(this.calendar.weekDaysCount, 'd'));
        let startDateDifference = ((+event.start.diff(startDate, 'days') > 0) ? +event.start.diff(startDate, 'days') : 0);
        let endDateDifference = (+event.end.diff(endDate, 'days') > 0) ? 0 : Math.abs(+event.end.diff(endDate, 'days'));
        let left = multiEvents.left + (startDateDifference * multiEvents.width);
        let width = (this.calendar.weekDaysCount - (startDateDifference + endDateDifference)) * multiEvents.width;
        return {
            width: width + "px",
            left: left + "px",
            height: this.calendar.multiEventHeight + "px",
            top: multiEvents.top + (this.calendar.multiEventHeight * eventIndex) + "px",
        };
    }

    private getMultiEventsContainerStyle() {
        return {height: this.calendar.multiEventHeight * (this.allMultiEvents.length > 1 ? this.allMultiEvents.length : 1)};
    }

    private displayDate(format, date) {
        return date.format(format);
    }

    private getTimeColStyle() {
        return {
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayColStyle() {
        return {
            width: `calc((100% - ${this.sheetTimeWidth}px) / ${this.calendar.weekDaysCount})`
        };
    }

    private buildHours() {
        this.sheetHours = [];
        let i = this.calendar.startHour;
        while (i <= this.calendar.endHour) {
            this.sheetHours.push(i);
            i++;
        }
    }

    private getSheetStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarsheet.element.nativeElement.offsetTop + 'px)',
        };
    }

    private getHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px'
        };
    }

    private getHalfHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + this.calendar.sheetHourHeight / 2 + 'px',
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'
        };
    }

    private notLastHour(hour) {
        return hour < this.sheetHours.length;
    }

    private getHourLabelStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayDividerStyle(day) {
        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount * day) + 'px',
            top: '0px',
            height: this.calendar.sheetHourHeight * this.sheetHours.length + 'px'
        };
    }

    private gotoDay(dow) {
        let navigateDate = moment(this.setdate);
        navigateDate.day(dow);
        this.navigateday.emit(navigateDate);
    }

    private getDropTargetStyle(hour, day) {
        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount * day) + 'px',
            width: ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount) + 'px',
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            height: this.calendar.sheetHourHeight + 'px',
        };
    }
}
