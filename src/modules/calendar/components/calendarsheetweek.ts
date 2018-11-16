import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output, SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

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
    @Input('othercalendars') private otherCalendars: any[] = [];
    @Input() private setdate: any = {};
    private sheetTimeWidth: number = 80;
    private sheetHours: Array<any> = [];
    private sheetTopMargin: number = 0;
    private calendarevents: Array<any> = [];
    private calendarMultiEvents: Array<any> = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private calendar: calendar) {
        this.buildHours();
        this.sheetDays = this.buildSheetDays();
    }


    public ngAfterViewInit() {
        this.calendarsheet.element.nativeElement.scrollTop = 8 * this.calendar.sheetHourHeight;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.sheetDays = this.buildSheetDays();
            this.getEvents();
        }
        if (changes.otherCalendars) {
            this.getOtherEvents(changes.otherCalendars.currentValue);
        }
    }

    get offset() {
        return moment().utcOffset();
    }

    private getOtherEvents(otherCalendars) {
        this.calendarevents = this.calendarevents.filter(event => event.data.assigned_user_id == this.calendar.owner);
        this.calendarMultiEvents = this.calendarMultiEvents.filter(event => event.data.assigned_user_id == this.calendar.owner);

        if (otherCalendars.length > 0) {
            let startDate = new moment(this.setdate).day(0).hour(this.calendar.startHour).minute(0).second(0);
            let endDate = new moment(startDate).add(moment.duration(this.calendar.weekDaysCount, 'd')).hour(this.calendar.endHour);
            for (let calendar of otherCalendars) {
                this.calendar.loadEvents(startDate, endDate, calendar.id).subscribe(events => {
                    if (events.length > 0) {
                        events = events.map(event => {
                            event.color = calendar.color;
                            event.visible = calendar.visible;
                            return event;
                        });
                        let OtherEvent = events.filter(event => !event.isMulti && event.visible);
                        let OtherMultiEvent = events.filter(event => event.isMulti && event.visible);
                        this.calendarevents.push(...OtherEvent);
                        this.calendarMultiEvents.push(...OtherMultiEvent);
                    }
                    this.calendarevents = this.calendar.arrangeEvents(this.calendarevents);
                    this.calendarMultiEvents = this.calendar.arrangeEvents(this.calendarMultiEvents);
                });
            }
        }

    }

    private getEvents() {
        this.calendarevents = this.calendarevents.filter(event => event.data.assigned_user_id != this.calendar.owner);
        this.calendarMultiEvents = this.calendarMultiEvents.filter(event => event.data.assigned_user_id != this.calendar.owner);
        let startDate = new moment(this.setdate).day(0).hour(this.calendar.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(this.calendar.weekDaysCount, 'd')).hour(this.calendar.endHour);
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                this.calendarevents.push(...events.filter(event => !event.isMulti));
                this.calendarMultiEvents.push(...events.filter(event => event.isMulti));
                this.calendarevents = this.calendar.arrangeEvents(this.calendarevents);
                this.calendarMultiEvents = this.calendar.arrangeEvents(this.calendarMultiEvents);
            }
        });
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
        }
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
        if (!this.multiEvents) {return;}
        let multiEvents = this.multiEvents.element.nativeElement.getBoundingClientRect();
        let startDate = new moment(this.setdate).day(0).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(this.calendar.weekDaysCount, 'd'));
        let startDateDifference = ((+event.start.diff(startDate, 'days') > 0) ? +event.start.diff(startDate, 'days'): 0);
        let endDateDifference =  (+event.end.diff(endDate, 'days') > 0) ? 0 : Math.abs(+event.end.diff(endDate, 'days'));
        let left = multiEvents.left + (startDateDifference * multiEvents.width);
        let width = (this.calendar.weekDaysCount - (startDateDifference + endDateDifference)) * multiEvents.width;
        return {
            width: width + "px",
            left: left + "px",
            height: this.calendar.multiEventHeight + "px",
            top: multiEvents.top + (this.calendar.multiEventHeight * eventIndex) + "px",
            padding: "2px"
        };

    }

    private getMultiEventsContainerStyle() {
        return {height: this.calendar.multiEventHeight * (this.calendarMultiEvents.length > 1 ? this.calendarMultiEvents.length : 1)};
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

    private rearrangeEvents() {
        this.calendarevents = this.calendar.arrangeEvents(this.calendarevents);
        this.calendarMultiEvents = this.calendar.arrangeEvents(this.calendarMultiEvents);
    }

}
