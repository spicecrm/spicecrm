import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    templateUrl: './app/modules/calendar/templates/calendar.html',
    providers: [calendar]
})
export class Calendar {

    @ViewChild('calendarcontent', {read: ViewContainerRef}) calendarcontent: ViewContainerRef;

    showTypeSelector: boolean = false;
    calendarDate: any = {};
    sheetType: string = 'Week';

    duration: any = {
        Day : 'd',
        Week : 'w',
        Month : 'M',
    }

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private calendar: calendar) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Calendar');

        this.calendarDate = new moment();
    }

    getOffset(){
        return moment().utcOffset()
    }

    setDateChanged(event){
        this.calendarDate = new moment(event);
    }

    toggleTypeSelector(){
        this.showTypeSelector = !this.showTypeSelector;
    }

    setType(sheetType){
        this.sheetType = sheetType;
        this.showTypeSelector = false;
    }

    goToday(){
        this.calendarDate = new moment();
    }

    gotToDayView(date){
        this.calendarDate = date;
        this.sheetType = 'Day';
    }

    goToWeekView(){
        this.sheetType = 'Week';
    }

    shiftPlus(){
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(1, this.duration[this.sheetType])));
    }
    shiftMinus(){
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(1, this.duration[this.sheetType])));
    }

    getCalendarHeader(){
        let focDate = new moment(this.calendarDate);
        switch(this.sheetType){
            case 'Week':
                return 'Week ' + this.getCalendarWeek() + ': ' + this.getFirstDayOfWeek() + ' - ' + this.getLastDayOfWeek();
            case 'Month':
                return focDate.format('MMMM YYYY');
            case 'Day':
                return focDate.format('MMMM D, YYYY');
        }
    }

    getCalendarWeek(){
        let focDate = new moment(this.calendarDate);
        focDate.day(1);
        return focDate.isoWeek();
    }

    getFirstDayOfWeek(){
        let focDate = new moment(this.calendarDate);
        focDate.day(0);
        return focDate.format('MMMM D, YYYY')
    }

    getLastDayOfWeek(){
        let focDate = new moment(this.calendarDate);
        focDate.day(7);
        return focDate.format('MMMM D, YYYY')
    }

    getContentStyle(){
        return{
            height: 'calc(100vh - ' + this.calendarcontent.element.nativeElement.offsetTop  + 'px)'
        }
    }

    zoomin(){
        this.calendar.sheetHourHeight += 10;
    }

    zoomout(){
        this.calendar.sheetHourHeight -= 10;
    }

    resetzoom(){
        this.calendar.sheetHourHeight = 80;
    }

}