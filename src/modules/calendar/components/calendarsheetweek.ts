import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
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

    public ngOnChanges() {

        this.sheetDays = this.buildSheetDays();
        this.getEvents();
    }

    get offset() {
        return moment().utcOffset();
    }

    get startHour() {
        return this.calendar.startHour;
    }

    get endHour() {
        return this.calendar.endHour;
    }

    get weekDaysCount() {
        return this.calendar.weekDaysCount;
    }

    get multiEventHeight() {
        return this.calendar.multiEventHeight;
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    private getEvents() {
        this.calendarevents = [];
        this.calendarMultiEvents = [];
        let startDate = new moment(this.setdate).day(0).hour(this.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(this.weekDaysCount, 'd')).hour(this.endHour);
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                this.calendarevents = events.filter(event => !event.isMulti);
                this.calendarMultiEvents = events.filter(event => event.isMulti);
            }
        });
    }

    // get sheetDays(): Array<any> {
    private buildSheetDays() {
        let sheetDays = [];

        // build the days
        let i = 0;
        let dayIndex = this.weekStartDay;
        while (i < this.weekDaysCount) {
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
        let startday = event.start.day() - this.weekStartDay;
        let startminutes = (event.start.hour() - this.startHour) * 60 + event.start.minute();
        let endminutes = (event.end.hour() - this.startHour) * 60 + event.end.minute();

        let itemWidth = ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.weekDaysCount) / (event.maxOverlay > 0 ? event.maxOverlay : 1);

        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.weekDaysCount * startday) + (itemWidth * event.displayIndex) + 'px',
            width: event.dragging ? itemWidth / 2 : itemWidth + 'px',
            top: this.calendar.sheetHourHeight / 60 * startminutes + 'px',
            height: this.calendar.sheetHourHeight / 60 * (endminutes - startminutes) + 'px'
        };
    }

    private getMultiEventStyle(event, eventIndex): any {
        if (!this.multiEvents) {return;}
        let multiEvents = this.multiEvents.element.nativeElement.getBoundingClientRect();
        let startDate = new moment(this.setdate).day(0).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(this.weekDaysCount, 'd'));
        let startDateDifference = ((+event.start.diff(startDate, 'days') > 0) ? +event.start.diff(startDate, 'days'): 0);
        let endDateDifference =  (+event.end.diff(endDate, 'days') > 0) ? 0 : Math.abs(+event.end.diff(endDate, 'days'));
        let left = multiEvents.left + (startDateDifference * multiEvents.width);
        let width = (this.weekDaysCount - (startDateDifference + endDateDifference)) * multiEvents.width;
        return {
            width: width + "px",
            left: left + "px",
            height: this.multiEventHeight + "px",
            top: multiEvents.top + (this.multiEventHeight * eventIndex) + "px",
            padding: "2px"
        };

    }

    private getMultiEventsContainerStyle() {
        return {height: this.multiEventHeight * (this.calendarMultiEvents.length > 1 ? this.calendarMultiEvents.length : 1)};
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
            width: `calc((100% - ${this.sheetTimeWidth}px) / ${this.weekDaysCount})`
        };
    }

    private buildHours() {
        this.sheetHours = [];
        let i = this.startHour;
        while (i <= this.endHour) {
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
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.weekDaysCount * day) + 'px',
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
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.weekDaysCount * day) + 'px',
            width: ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / this.weekDaysCount) + 'px',
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            height: this.calendar.sheetHourHeight + 'px',
        };
    }

    private rearrangeEvents() {
        this.calendarevents = this.calendar.arrangeEvents(this.calendarevents);
        this.calendarMultiEvents = this.calendar.arrangeEvents(this.calendarMultiEvents);
    }

}
