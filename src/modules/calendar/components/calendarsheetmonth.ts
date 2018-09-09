import {
    AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Input, Output, EventEmitter,
    OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-month',
    templateUrl: './app/modules/calendar/templates/calendarsheetmonth.html',
})
export class CalendarSheetMonth implements OnChanges {

    @ViewChild('calendarsheet', {read: ViewContainerRef}) calendarsheet: ViewContainerRef;
    @Input() setdate: any = {};
    @Output() navigateday: EventEmitter<any> = new EventEmitter<any>();

    currentGrid: Array<any> = [];

    get sheetDays(): Array<any> {
        let sheetDays = [];

        // build the days
        let i = 0;
        let days = moment.weekdaysShort();
        while (i < 7) {
            sheetDays.push({
                index: i,
                text: days[i]
            });
            i++;
        }

        return sheetDays;
    };

    sheetTopMargin: number=0;

    calendarevents: Array<any> = [];

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private calendar: calendar) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Calendar');

    }

    ngOnChanges(changes: SimpleChanges){
        this.buildGrid();

        this.calendarevents = [];
        let startDate = new moment(this.setdate).date(1).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M'));
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if(events.length > 0)
                // sort the events
                events.sort((a, b) => {
                    if (a.start < b.start)
                        return -1;
                    if (a.start === b.start) {
                        if (a.end > b.end)
                            return -1;
                        else
                            return 1;
                    }
                    return 1;
                });

                this.calendarevents = events;
        });
    }

    gotoDay(sheetday){
        let navigateDate = moment(this.setdate);
        navigateDate.month(sheetday.month).date(sheetday.day);
        this.navigateday.emit(navigateDate);
    }

    getDayColStyle() {
        return {
            width: 'calc(100% / 7)'
        }
    }

    getSheetStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarsheet.element.nativeElement.offsetTop + 'px)',
        }
    }

    getDayDividerStyle(day){
        return {
            left: (this.calendarsheet.element.nativeElement.clientWidth / 7 * day) + 'px',
            top: '0px',
            height: '100%'
        }
    }

    buildGrid(){
        this.currentGrid = [];
        // let fdom = new moment(this.curDate.year() + '-' + (this.curDate.month() + 1) + '-' + '01');
        let fdom = new moment(this.setdate);
        // move to first day of month
        fdom.date(1);
        // move to Sunday
        fdom.day(0);

        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = [];
            if((fdom.year() < this.setdate.year()) || (fdom.month() <= this.setdate.month())) {
                while (i < 7) {
                    week.push({day: fdom.date(), month: fdom.month()});

                    fdom.add(1, 'd');
                    i++;
                }
                this.currentGrid.push(week);
            }
            j++;
        }
    };

    notLastWeek(week){
        return week  < this.currentGrid.length;
    }

    notThisMonth(month){
        return month !== this.setdate.month();
    }

    getWeekDividerStyle(week) {
        return {
            top: 'calc((100% / ' + this.currentGrid.length +') * '+ week +' )'
        }
    }

    getBoxStyle(i, j, month){
        return {
            left: (this.calendarsheet.element.nativeElement.clientWidth / 7 * j) + 'px',
            top: 'calc((100% / ' + this.currentGrid.length +') * '+ i +' )',
            color: this.notThisMonth(month) ? '#9faab5' : 'inherit',
            'background-color': this.notThisMonth(month) ? '#f4f6f9' : 'transparent',
            width: (this.calendarsheet.element.nativeElement.clientWidth / 7) + 'px',
            height: 'calc(100% / ' + this.currentGrid.length +')',
        }
    }

    getCellEvents(i, j){
        let cellEvents: Array<any> = [];
        let cellDate = this.currentGrid[i][j];
        for(let event of this.calendarevents){
            if(event.start.date() === cellDate.day && event.start.month() === cellDate.month){
                cellEvents.push(event);
            }
        }
        return cellEvents;
    }

}