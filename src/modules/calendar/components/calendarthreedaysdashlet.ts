/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from '../services/calendar.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display a three days view to be rendered in a dashboard as dashlet
 */
@Component({
    selector: 'calendar-three-days-dashlet',
    templateUrl: './src/modules/calendar/templates/calendarthreedaysdashlet.html',
    providers: [calendar]
})

export class CalendarThreeDaysDashlet {
    /**
     * reference of calendar content div
     */
    @ViewChild('calendarcontent', {read: ViewContainerRef, static: true}) private calendarContent: ViewContainerRef;
    /**
     * holds the dashlet label
     */
    private dashletLabel: any = null;

    constructor(private language: language,
                private elementRef: ElementRef,
                private calendar: calendar) {
        this.setCalendarType();
    }

    /**
     * @return calendarDate: moment
     */
    get calendarDate() {
        return this.calendar.calendarDate;
    }

    /**
     * @return style: object height of the calendar content
     */
    get contentStyle() {
        return {
            height: (this.calendarContent ? this.elementRef.nativeElement.getBoundingClientRect().height - this.calendarContent.element.nativeElement.offsetTop : 100) + 'px',
        };
    }

    /**
     * set the calendar type and is dashlet value
     */
    private setCalendarType() {
        this.calendar.isDashlet = true;
        this.calendar.sheetType = 'Three_Days';
        this.calendar.sheetHourHeight = 50;
    }
}
