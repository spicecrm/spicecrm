/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from '../services/calendar.service';

/**
 * Display a day view to be rendered in a dashboard as dashlet
 */
@Component({
    selector: 'calendar-day-dashlet',
    templateUrl: './src/modules/calendar/templates/calendardaydashlet.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [calendar]
})

export class CalendarDayDashlet {
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
        this.calendar.isDashlet = true;
        this.calendar.sheetType = 'Day';
        this.calendar.sheetHourHeight = 50;
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
}
