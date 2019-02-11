import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar-three-days-dashlet',
    templateUrl: './src/modules/calendar/templates/calendarthreedaysdashlet.html',
    providers: [calendar]
})

export class CalendarThreeDaysDashlet {
    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarContent: ViewContainerRef;
    private titleUntilDate: any = {};

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
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
            height: `calc(100% - ${this.calendarContent.element.nativeElement.offsetTop}px)`,
            width: '100%'
        };
    }
}
