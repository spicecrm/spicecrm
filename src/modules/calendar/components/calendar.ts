import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    templateUrl: './src/modules/calendar/templates/calendar.html',
    providers: [calendar]
})
export class Calendar {

    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarcontent: ViewContainerRef;

    private showTypeSelector: boolean = false;
    private calendarDate: any = {};
    private sheetType: string = 'Day';

    private duration: any = {
        Day: 'd',
        Week: 'w',
        Month: 'M',
    };

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private calendar: calendar) {
        this.navigation.setActiveModule('Calendar');
        this.calendarDate = new moment();
    }

    private getContentStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarcontent.element.nativeElement.offsetTop + 'px)'
        };
    }

    private getCalendarHeader() {
        let focDate = new moment(this.calendarDate);
        switch (this.sheetType) {
            case 'Week':
                return 'Week ' + this.getCalendarWeek() + ': ' + this.getFirstDayOfWeek() + ' - ' + this.getLastDayOfWeek();
            case 'Month':
                return focDate.format('MMMM YYYY');
            case 'Day':
                return focDate.format('MMMM D, YYYY');
        }
    }

    private getCalendarWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(1);
        return focDate.isoWeek();
    }

    private getFirstDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(0);
        return focDate.format('MMMM D, YYYY');
    }

    private getLastDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(7);
        return focDate.format('MMMM D, YYYY');
    }

    private setDateChanged(event) {
        this.calendarDate = new moment(event);
    }

    private toggleTypeSelector() {
        this.showTypeSelector = !this.showTypeSelector;
    }

    private setType(sheetType) {
        this.sheetType = sheetType;
        this.showTypeSelector = false;
    }

    private goToday() {
        this.calendarDate = new moment();
    }

    private gotToDayView(date) {
        this.calendarDate = date;
        this.sheetType = 'Day';
    }

    private goToWeekView() {
        this.sheetType = 'Week';
    }

    private shiftPlus() {
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(1, this.duration[this.sheetType])));
    }

    private shiftMinus() {
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(1, this.duration[this.sheetType])));
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
}
