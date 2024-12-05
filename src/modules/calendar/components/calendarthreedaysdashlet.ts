/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, InjectionToken, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from '../services/calendar.service';

/**
 * Display a three days view to be rendered in a dashboard as dashlet
 */
@Component({
    selector: 'calendar-three-days-dashlet',
    templateUrl: '../templates/calendarthreedaysdashlet.html',
    providers: [calendar, {provide: 'calendarConfigOverride', useFactory: () => ({
            isDashlet: true,
            sheetType: 'Three_Days',
            sheetHourHeight: 50
    })}]
})

export class CalendarThreeDaysDashlet implements OnInit {
    /**
     * the dashlet config passed from the parent component
     * @private
     */
    public dashletconfig: any = null;
    /**
     * reference of calendar content div
     */
    @ViewChild('calendarcontent', {read: ViewContainerRef, static: true}) public calendarContent: ViewContainerRef;
    /**
     * holds the dashlet label
     */
    public dashletLabel: any = null;

    constructor(public language: language,
                public elementRef: ElementRef,
                public calendar: calendar) {
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

    public ngOnInit() {
        this.calendar.customOwner = this.dashletconfig?.userId;
    }
}
