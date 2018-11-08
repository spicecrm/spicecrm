import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-month-day',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonthday.html',
    host: {
        'class': 'slds-is-absolute slds-truncate'
    }
})
export class CalendarSheetMonthDay {
    @ViewChild('daycontainer', {read: ViewContainerRef}) private dayContainer: ViewContainerRef;
    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @Input() private sheetday: any = {};
    @Input() private events: Array<any> = [];

    constructor(private language: language, private calendar: calendar) {

    }

    get multiEventHeight() {
        return this.calendar.multiEventHeight;
    }

    private gotoDay() {
        this.navigateday.emit(this.sheetday);
    }

    private isTodayStyle() {
        let today = new moment();
        return {
            'background-color': today.month() === this.sheetday.month && today.date() == this.sheetday.day ? this.calendar.todayColor : 'inherit',
            'border-radius': '50%',
            'line-height': '1rem',
            'text-align': 'center',
            color: today.month() === this.sheetday.month && today.date() == this.sheetday.day ? '#fff' : 'inherit',
            width: '1rem',
            height: '1rem',
            display: 'block',
        }
    }

    private getEventStyle(index): any {
        let eventsContainer = this.dayContainer.element.nativeElement;
        return {
            height: this.multiEventHeight + "px",
            width: eventsContainer.clientWidth,
            top: eventsContainer.clientTop + eventsContainer.clientHeight + (eventsContainer.clientTop * index),
            padding: "2px"
        };
    }
}
