/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display a schedule view to be rendered in a dashboard as dashlet
 */
@Component({
    selector: 'calendar-schedule-dashlet',
    templateUrl: '../templates/calendarscheduledashlet.html',
    providers: [calendar]
})

export class CalendarScheduleDashlet implements OnInit {
    /**
     * the dashlet config passed from the parent component
     * @private
     */
    public dashletconfig: any = null;
    /**
     * holds the schedule until date
     */
    public scheduleUntilDate: any = {};
    /**
     * dom reference for the header container
     */
    @ViewChild('headercontainer', {read: ViewContainerRef, static: true}) public headerContainer: ViewContainerRef;

    constructor(public language: language,
                public navigation: navigation,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public calendar: calendar) {
        this.calendar.isDashlet = true;
        this.calendar.sheetType = 'Schedule';
        this.scheduleUntilDate = new moment().minute(0).second(0).add(1, "M");
    }

    /**
     * @return calendarDate: moment
     */
    get calendarDate() {
        return this.calendar.calendarDate;
    }

    /**
     * @return style: object height and width of the calendar content
     */
    get contentStyle() {
        return {
            height: this.headerContainer ? `calc(100% - ${this.headerContainer.element.nativeElement.offsetHeight}px)` : '100px',
            width: '100%'
        };
    }

    /**
     * @return title: string
     */
    get title() {
        return new moment(this.calendarDate).format("MMM D, YYYY") + ' - ' + this.scheduleUntilDate.format("MMM D, YYYY");
    }

    public ngOnInit() {
        this.calendar.customOwner = this.dashletconfig.userId;
    }
}
