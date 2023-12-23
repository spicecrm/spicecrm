/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {calendar} from "../services/calendar.service";

/**
 * Display a palette of colors to emit the picked color hex.
 */
@Component({
    selector: 'calendar-color-picker',
    templateUrl: '../templates/calendarcolorpicker.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarColorPicker {

    @Output() public colorChange: EventEmitter<any> = new EventEmitter<any>();
    /**
     * boolean to show/hide the color palette
     */
    public isOpen: boolean = false;

    constructor(public calendar: calendar) {
    }


    /**
     * emit the picked color and close the palette
     * @param color
     */
    public pickColor(color) {
        this.colorChange.emit('#' + color);
        this.isOpen = false;
    }
}
