/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

/**
* @ignore
*/
declare var moment: any;
/**
* @ignore
*/
declare var _: any;

@Component({
    selector: 'calendar-schedule-dashlet',
    templateUrl: './src/modules/calendar/templates/calendarscheduledashlet.html',
    providers: [calendar]
})

export class CalendarScheduleDashlet {

    public scheduleUntilDate: any = {};
    @ViewChild('calendarcontent', {read: ViewContainerRef, static: true}) private calendarcontent: ViewContainerRef;
    @ViewChild('headercontainer', {read: ViewContainerRef, static: true}) private headerContainer: ViewContainerRef;

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private calendar: calendar) {
        this.calendar.isDashlet = true;
        this.scheduleUntilDate = new moment().minute(0).second(0).add(1, "M");
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    get contentStyle() {
        return {
            height: `calc(100% - ${this.headerContainer.element.nativeElement.offsetHeight}px)`,
            width: '100%'
        };
    }

    get title() {
        return new moment(this.calendarDate).format("MMM D, YYYY") + ' - ' + this.scheduleUntilDate.format("MMM D, YYYY");
    }
}