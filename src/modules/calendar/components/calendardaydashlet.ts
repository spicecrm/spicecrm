import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar-day-dashlet',
    templateUrl: './src/modules/calendar/templates/calendardaydashlet.html',
    providers: [calendar]
})

export class CalendarDayDashlet {
    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarContent: ViewContainerRef;

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private calendar: calendar) {
        this.calendar.isDashlet = true;
        this.calendar.sheetHourHeight = 50;
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    get contentStyle() {
        return {
            height: `calc(100% - ${this.calendarContent.element.nativeElement.offsetTop}px)`,
            width: '100%'
        };
    }
}