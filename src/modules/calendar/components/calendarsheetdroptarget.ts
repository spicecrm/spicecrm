/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {calendar} from '../services/calendar.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'calendar-sheet-drop-target',
    templateUrl: './src/modules/calendar/templates/calendarsheetdroptarget.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSheetDropTarget {

    /**
     * @input day: moment
     */
    @Input() private day: any;
    /**
     * @input hour: number
     */
    @Input() private hour: number = 0;

    private minutes: number = 0;

    constructor(private calendar: calendar, private cdr: ChangeDetectorRef, public elementRef: ElementRef) {
    }

    /**
     * @return date: moment
     */
    get date() {
        return this.day ? moment(this.day.date) : this.calendar.calendarDate;
    }

    /**
     * @Input hourPart: number
     * @param value: number
     * @set minutes
     */
    @Input()
    private set hourPart(value: number) {
        this.minutes = value ? 15 * value : 0;
    }

    /**
     * @call ChangeDetectorRef.detach
     */
    public ngAfterViewInit() {
        this.cdr.detach();
    }

    /**
     * @emit date by pickerDate$
     * @emit date by addingEvent$
     */
    private addEvent() {
        const date = moment(this.date);
        date.hour(this.hour).minute(this.minutes).second(0);
        if (this.calendar.asPicker) {
            this.calendar.pickerDate$.emit(date);
        } else {
            this.calendar.addingEvent$.emit(date);
        }
    }
}
