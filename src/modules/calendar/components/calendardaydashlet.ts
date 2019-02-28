import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from '../services/calendar.service';

@Component({
    selector: 'calendar-day-dashlet',
    templateUrl: './src/modules/calendar/templates/calendardaydashlet.html',
    providers: [calendar]
})

export class CalendarDayDashlet {
    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarContent: ViewContainerRef;

    private dashletconfig: any = null;
    private dashletLabel: any = null;
    private icon: any = null;

    constructor(private language: language,
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
            height: this.elementRef.nativeElement.getBoundingClientRect().height - this.calendarContent.element.nativeElement.offsetTop + 'px',
        };
    }
}
