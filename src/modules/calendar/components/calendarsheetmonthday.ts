import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-month-day',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonthday.html',
    host: {
        'class': 'slds-is-absolute slds-truncate'
    }
})
export class CalendarSheetMonthDay {
    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @Input() private sheetday: any = {};
    @Input() private events: Array<any> = [];

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef) {

    }

    private gotoDay() {
        this.navigateday.emit(this.sheetday);
    }

    private getDisplayEvents() {
//
    }
}
