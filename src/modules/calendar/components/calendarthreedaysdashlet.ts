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

    @ViewChild('calendarcontent', {read: ViewContainerRef, static: true}) private calendarContent: ViewContainerRef;
    private titleUntilDate: any = {};
    private dashletLabel: any = null;

    constructor(private language: language,
                private elementRef: ElementRef,
                private calendar: calendar) {
        this.calendar.isDashlet = true;
        this.calendar.sheetType = 'Three_Days';
        this.calendar.sheetHourHeight = 50;
        this.titleUntilDate = moment(this.calendar.calendarDate).add(2, 'd');
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
