/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {calendar} from '../services/calendar.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display the input hour part and emit the click inside to add an event in place
 */
@Component({
    selector: 'calendar-sheet-drop-target',
    templateUrl: '../templates/calendarsheetdroptarget.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSheetDropTarget {

    /**
     * holds the moment day
     */
    @Input() public day: any;
    /**
     * holds the hour
     */
    @Input() public hour: number = 0;
    /**
     * holds the minutes
     */
    public minutes: number = 0;

    constructor(public calendar: calendar, public cdr: ChangeDetectorRef, public elementRef: ElementRef) {
    }

    /**
     * @return date: moment
     */
    get date() {
        return this.day ? moment(this.day.date) : this.calendar.calendarDate;
    }

    /**
     * set the hour part from parent input
     */
    @Input()
    public set hourPart(value: number) {
        this.minutes = value ? 15 * value : 0;
    }

    /**
     * detach change detection to improve performance
     */
    public ngAfterViewInit() {
        this.cdr.detach();
    }

    /**
     * handle the mouse click and emit the date
     */
    public addEvent() {
        const date = moment(this.date);
        date.hour(this.hour).minute(this.minutes).second(0);
        if (this.calendar.asPicker) {
            this.calendar.pickerDate$.emit(date);
        } else {
            this.calendar.addingEvent$.emit(date);
        }
    }
}
