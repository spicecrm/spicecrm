/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from '../services/calendar.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'calendar-three-days-dashlet',
    templateUrl: './src/modules/calendar/templates/calendarthreedaysdashlet.html',
    providers: [calendar]
})

export class CalendarThreeDaysDashlet {
    @ViewChild('calendarcontent', {read: ViewContainerRef, static: false}) private calendarContent: ViewContainerRef;
    private titleUntilDate: any = {};

    constructor(private language: language,
                private elementRef: ElementRef,
                private calendar: calendar) {
        this.calendar.isDashlet = true;
        this.calendar.sheetHourHeight = 50;
        this.titleUntilDate = moment(this.calendar.calendarDate).add(2, 'd');
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
