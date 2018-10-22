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
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @Input() private setdate: any = {};
    private sheetTimeWidth: number = 80;
    private sheetDays: Array<any> = [];
    private sheetHours: Array<any> = [];
    private sheetTopMargin: number = 0;
    private sheetHourHeight: number = 60;
    private calendarevents: Array<any> = [];

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private calendar: calendar) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Calendar');

        // some initialization
        this.buildHours();

        this.sheetDays = this.buildSheetDays();

        // this.calendar.sheetHourHeight = this.calendar.sheetHourHeight;
    }

    public ngAfterViewInit() {
        this.calendarsheet.element.nativeElement.scrollTop = 8 * this.calendar.sheetHourHeight;
    }

    public ngOnChanges() {

        this.sheetDays = this.buildSheetDays();

        this.calendarevents = [];
        let startDate = new moment(this.setdate).day(0).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(7, 'd'));
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                this.calendarevents = this.calendar.arrangeEvents(events);
            }
        });
    }

    // get sheetDays(): Array<any> {
    private buildSheetDays() {
        let sheetDays = [];

        // build the days
        let i = 0;
        while (i < 7) {
            let focDate = new moment(this.setdate);
            focDate.day(i);
            sheetDays.push({
                index: i,
                text: focDate.format('ddd D'),
                date: focDate
            });
            i++;
        }

        return sheetDays;
    };

    private getOffset() {
        return moment().utcOffset();
    }

    private getEventStyle(event) {
        // get the day of the week
        let startday = event.start.day();
        let startminutes = event.start.hour() * 60 + event.start.minute();
        let endminutes = event.end.hour() * 60 + event.end.minute();

        let itemWidth = ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7) / (event.maxOverlay > 0 ? event.maxOverlay : 1);

        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7 * startday) + (itemWidth * event.displayIndex) + 'px',
            width: event.dragging ? itemWidth / 2 : itemWidth + 'px',
            top: this.calendar.sheetHourHeight / 60 * startminutes + 'px',
            height: this.calendar.sheetHourHeight / 60 * (endminutes - startminutes) + 'px'
        };
    }

    private getTimeColStyle() {
        return {
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayColStyle() {
        return {
            width: 'calc((100% - ' + this.sheetTimeWidth + 'px) / 7)'
        };
    }

    private buildHours() {
        this.sheetHours = [];
        let i = 0;
        while (i <= 24) {
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
        return hour + 1 < this.sheetHours.length;
    }

    private getHourLabelStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayDividerStyle(day) {
        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7 * day) + 'px',
            top: '0px',
            height: this.calendar.sheetHourHeight * (this.sheetHours.length - 1) + 'px'
        };
    }

    private gotoDay(dow) {
        let navigateDate = moment(this.setdate);
        navigateDate.day(dow);
        this.navigateday.emit(navigateDate);
    }

    private getDropTargetStyle(hour, day) {
        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7 * day) + 'px',
            width: ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7) + 'px',
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            height: this.calendar.sheetHourHeight + 'px',
        };
    }

    private rearrangeEvents() {
        this.calendarevents = this.calendar.arrangeEvents(this.calendarevents);
    }

}
