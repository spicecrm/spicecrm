/**
 * @module ModuleCalendar
 */
import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {calendar} from "../services/calendar.service";

@Component({
    selector: 'calendar-sheet-google-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetgoogleevent.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSheetGoogleEvent implements AfterViewInit {
    /**
     * emit to handle event changes
     */
    @Output() public eventChange: EventEmitter<any> = new EventEmitter<any>();
    /**
     * holds the google event data
     */
    @Input() private event;

    constructor(private calendar: calendar) {
    }

    /**
     * emit the event change to define its style
     */
    public ngAfterViewInit() {
        this.eventChange.emit();
    }
}
