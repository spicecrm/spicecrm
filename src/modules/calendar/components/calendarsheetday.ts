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
import {session} from '../../../services/session.service';
import {backend} from '../../../services/backend.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-day',
    templateUrl: './src/modules/calendar/templates/calendarsheetday.html',
})
export class CalendarSheetDay implements OnChanges, AfterViewInit {

    @Output() public navigateweek: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @ViewChild('multievents', {read: ViewContainerRef}) private multiEvents: ViewContainerRef;
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('googlecalendarvisible') private googleCalendarVisible: boolean = true;
    @Input() private setdate: any = {};
    private sheetTimeWidth: number = 80;
    private sheetTopMargin: number = 0;
    private sheetDay: any = {};
    private sheetHours: Array<any> = [];
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
                private session: session,
                private calendar: calendar) {
        this.buildHours();
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
            this.sheetDay = {date: changes.setdate.currentValue};
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
        let startDate = new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add((this.calendar.endHour - this.calendar.startHour), 'h');
        this.ownerEvents = [];
        this.ownerMultiEvents = [];

        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                events = events.filter(event => event.start.hour() >= this.calendar.startHour && event.end.hour() <= this.calendar.endHour);
                this.ownerEvents = events.filter(event => !event.isMulti);
                this.ownerMultiEvents = events.filter(event => event.isMulti);
            }
        });
    }

    private getGoogleEvents(reload = false) {
        if (!this.calendar.loggedByGoogle) {
            return;
        }
        let startDate = new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add((this.calendar.endHour - this.calendar.startHour), 'h');
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
        let startDate = new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add((this.calendar.endHour - this.calendar.startHour), 'h');
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

    private displayDate(format) {
        return this.setdate.format(format);
    }

    private getEventStyle(event): any {
        // get the day of the week
        let startminutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
        let endminutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
        let itemWidth = ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth)) / (event.maxOverlay > 0 ? event.maxOverlay : 1);
        return {
            left: this.sheetTimeWidth + (itemWidth * event.displayIndex) + 'px',
            width: itemWidth + 'px',
            top: this.calendar.sheetHourHeight / 60 * startminutes + 'px',
            height: this.calendar.sheetHourHeight / 60 * (endminutes - startminutes) + 'px',
            'z-index': event.resizing ? 20 : 15,
            'border-bottom': event.resizing ? '1px dotted #fff' : 0
        };

    }

    private getMultiEventStyle(index): any {
        let multiEvents = this.multiEvents.element.nativeElement.getBoundingClientRect();
        return {
            height: this.calendar.multiEventHeight + "px",
            width: multiEvents.width + "px",
            top: multiEvents.top + (this.calendar.multiEventHeight * index) + "px",
            left: multiEvents.left + "px",
            padding: "1px"
        };

    }

    private getMultiEventsContainerStyle() {
        return {height: this.calendar.multiEventHeight * (this.allMultiEvents.length > 1 ? this.allMultiEvents.length : 1)};
    }

    private getTimeColStyle() {
        return {
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayColStyle() {
        return {
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'
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

    private isTodayStyle() {
        let today = new moment();
        return {
            color: today.year() === this.setdate.year() && today.month() === this.setdate.month() && today.date() == this.setdate.date() ? '#eb7092' : 'inherit'
        };
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

    private getDayDividerStyle() {
        return {
            left: this.sheetTimeWidth + 'px',
            top: '0px',
            height: this.calendar.sheetHourHeight * this.sheetHours.length + 'px'
        };
    }

    private gotoWeek() {
        this.navigateweek.emit();
    }

    private getDropTargetStyle(hour) {
        return {
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)',
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            height: this.calendar.sheetHourHeight + 'px'
        };
    }
}
