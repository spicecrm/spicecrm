import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar',
    templateUrl: './src/modules/calendar/templates/calendar.html',
    providers: [calendar]
})

export class Calendar {
    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarcontent: ViewContainerRef;

    public usersCalendars: any[] = [];
    public otherCalendars: any[] = [];
    public googleIsVisible: boolean = true;
    public scheduleUntilDate: any = {};
    private showTypeSelector: boolean = false;
    private sheetType: string = 'Week';
    private self: any = {};
    private duration: any = {
        Day: 'd',
        Three_Days: 'd',
        Week: 'w',
        Month: 'M',
        Schedule: 'M',
    };

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private calendar: calendar) {
        this.navigation.setActiveModule('Calendar');
        this.calendarDate = new moment();
        this.scheduleUntilDate = new moment().minute(0).second(0).add(1, "M");
        this.calendar.usersCalendars$.subscribe(res => this.usersCalendars = res);
        this.calendar.otherCalendars$.subscribe(res => this.otherCalendars = res);
    }

    get owner() {
        return this.calendar.owner;
    }

    get sidebarWidth() {
        return this.calendar.sidebarWidth;
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get weekDaysCount() {
        return this.calendar.weekDaysCount;
    }

    set calendarDate(value) {
        this.calendar.calendarDate = value;
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    set asPicker(value) {
        if (value) {
            this.sheetType = 'Three_Days';
            this.calendar.asPicker = value;
        } else {
            this.closeModal();
        }
    }

    get asPicker() {
        return this.calendar.asPicker;
    }

    private addOtherCalendar() {
        this.calendar.addOtherCalendar();
    }

    private getContentStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarcontent.element.nativeElement.offsetTop + 'px)'
        };
    }

    private getSheetStyle() {
        return {
            width: `calc(100% - ${this.sidebarWidth}px)`,
            height: '100%',
        };
    }

    private getCalendarHeader() {
        const focDate = new moment(this.calendarDate);
        switch (this.sheetType) {
            case 'Week':
                return 'Week ' + this.getCalendarWeek() + ': ' + this.getFirstDayOfWeek() + ' - ' + this.getLastDayOfWeek();
            case 'Month':
                return focDate.format('MMMM YYYY');
            case 'Day':
                return focDate.format('MMMM D, YYYY');
            case 'Schedule':
                return focDate.format("MMM D, YYYY") + ' - ' + this.scheduleUntilDate.format("MMM D, YYYY");
            case 'Three_Days':
                return focDate.format("MMM D, YYYY") + ' - ' + moment(focDate.add(2, 'd')).format("MMM D, YYYY");
        }
    }

    private getCalendarWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(1);
        return focDate.isoWeek();
    }

    private getFirstDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekStartDay);
        return focDate.format('MMMM D, YYYY');
    }

    private getLastDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekDaysCount);
        return focDate.format('MMMM D, YYYY');
    }

    private setDateChanged(event) {
        this.calendarDate = new moment(event);
        this.refresh();
    }

    private toggleTypeSelector() {
        this.showTypeSelector = !this.showTypeSelector;
    }

    private setType(sheetType) {
        this.sheetType = sheetType;
        this.refresh();
        this.showTypeSelector = false;
    }

    private goToday() {
        this.calendarDate = new moment();
    }

    private gotToDayView(date) {
        this.calendarDate = new moment(date);
        this.refresh();
        this.sheetType = 'Day';
    }

    private shiftPlus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay + (this.weekDaysCount - 1)) {
            this.calendarDate = new moment(this.calendarDate.add(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(this.sheetType == 'Three_Days'? 3 : 1, this.duration[this.sheetType])));
    }

    private shiftMinus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay) {
            this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(this.sheetType == 'Three_Days'? 3 : 1, this.duration[this.sheetType])));
    }

    private zoomin() {
        this.calendar.sheetHourHeight += 10;
    }

    private zoomout() {
        this.calendar.sheetHourHeight -= 10;
    }

    private resetzoom() {
        this.calendar.sheetHourHeight = 80;
    }

    private refresh() {
        this.calendar.currentStart = {};
        this.calendar.currentEnd = {};
        this.calendarDate = new moment(this.calendar.calendarDate);
    }

    private closeModal() {
        this.self.destroy();
    }
}