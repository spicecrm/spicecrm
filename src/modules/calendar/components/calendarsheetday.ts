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
    selector: 'calendar-sheet-day',
    templateUrl: './src/modules/calendar/templates/calendarsheetday.html',
})
export class CalendarSheetDay implements OnChanges, AfterViewInit {

    @Output() public navigateweek: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @ViewChild('multievents', {read: ViewContainerRef}) private multiEvents: ViewContainerRef;
    @Input() private setdate: any = {};
    private sheetTimeWidth: number = 80;
    private sheetTopMargin: number = 0;
    private sheetDay: any = {};
    private sheetHours: Array<any> = [];
    private calendarevents: Array<any> = [];
    private calendarMultiEvents: Array<any> = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private calendar: calendar) {
        this.buildHours();
    }

    public ngAfterViewInit() {
        this.calendarsheet.element.nativeElement.scrollTop = 8 * this.calendar.sheetHourHeight;
    }

    public ngOnChanges() {

        this.sheetDay = {date: this.setdate};
        this.getEvents();
    }

    get multiEventHeight() {
        return this.calendar.multiEventHeight;
    }

    get sheetHourHeight() {
        return this.calendar.sheetHourHeight;
    }

    get startHour() {
        return this.calendar.startHour;
    }

    get endHour() {
        return this.calendar.endHour;
    }

    private getEvents() {
        this.calendarevents = [];
        this.calendarMultiEvents = [];
        let startDate = new moment(this.setdate).hour(this.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add((this.endHour - this.startHour), 'h');
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                this.calendarevents = events.filter(event => !event.isMulti);
                this.calendarMultiEvents = events.filter(event => event.isMulti);
            }
        });
    }

    private displayDate(format) {
        return this.setdate.format(format);
    }

    private getEventStyle(event): any {
        // get the day of the week
        let startminutes = (event.start.hour() - this.startHour) * 60 + event.start.minute();
        let endminutes = (event.end.hour() - this.startHour) * 60 + event.end.minute();
        let itemWidth = ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth)) / (event.maxOverlay > 0 ? event.maxOverlay : 1);

        return {
            left: this.sheetTimeWidth + (itemWidth * event.displayIndex) + 'px',
            width: itemWidth + 'px',
            top: this.sheetHourHeight / 60 * startminutes + 'px',
            height: this.sheetHourHeight / 60 * (endminutes - startminutes) + 'px',
            'z-index': event.dragging ? 15 : 20
        };

    }

    private getMultiEventStyle(index): any {
        let multiEvents = this.multiEvents.element.nativeElement.getBoundingClientRect();
        return {
            height: this.multiEventHeight + "px",
            width: multiEvents.width + "px",
            top: multiEvents.top + (this.multiEventHeight * index) + "px",
            left: multiEvents.left + "px",
            padding: "2px"
        };

    }

    private getMultiEventsContainerStyle() {
        return {height: this.multiEventHeight * (this.calendarMultiEvents.length > 1 ? this.calendarMultiEvents.length : 1)};
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
        let i = this.startHour;
        while (i <= this.endHour) {
            this.sheetHours.push(i);
            i++;
        }
    }

    private isTodayStyle() {
        let today = new moment();
        return {
            color: today.year() === this.setdate.year() && today.month() === this.setdate.month() && today.date() == this.setdate.date() ? '#eb7092' : 'inherit'
        }
    }

    private getSheetStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarsheet.element.nativeElement.offsetTop + 'px)',
        };
    }

    private getHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.sheetHourHeight * hour + 'px'
        };
    }

    private getHalfHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.sheetHourHeight * hour + this.sheetHourHeight / 2 + 'px',
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'
        };
    }

    private notLastHour(hour) {
        return hour < this.sheetHours.length;
    }

    private getHourLabelStyle(hour) {
        return {
            top: this.sheetTopMargin + this.sheetHourHeight * hour + 'px',
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayDividerStyle() {
        return {
            left: this.sheetTimeWidth + 'px',
            top: '0px',
            height: this.sheetHourHeight * this.sheetHours.length + 'px'
        };
    }

    private gotoWeek() {
        this.navigateweek.emit();
    }

    private getDropTargetStyle(hour) {
        return {
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)',
            top: this.sheetTopMargin + this.sheetHourHeight * hour + 'px',
            height: this.sheetHourHeight + 'px'
        };
    }

    private rearrangeEvents() {
        this.calendarevents = this.calendar.arrangeEvents(this.calendarevents);
        this.calendarMultiEvents = this.calendar.arrangeEvents(this.calendarMultiEvents);
    }
}
