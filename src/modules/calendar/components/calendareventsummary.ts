import {Component, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';

declare var moment: any;

@Component({
    selector: 'calendar-event-summary',
    templateUrl: './src/modules/calendar/templates/calendareventsummary.html'

})
export class CalendarEventSummary {

    private showPopover: boolean = false;

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private model: model) {
        // set theenavigation paradigm
    }

    private togglePopover() {
        this.showPopover = !this.showPopover;
    }

}