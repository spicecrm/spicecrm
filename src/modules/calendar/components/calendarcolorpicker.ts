/**
 * @module ModuleCalendar
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'calendar-color-picker',
    templateUrl: './src/modules/calendar/templates/calendarcolorpicker.html',
})
export class CalendarColorPicker {
    public colors: any[] = [
        'e3abec', 'c2dbf7', '9fd6ff', '9de7da', '9df0c0', 'fff099', 'fed49a',
        'd073e0', '86baf3', '5ebbff', '44d8be', '3be282', 'ffe654', 'ffb758',
        'bd35bd', '5779c1', '5ebbff', '00aea9', '3cba4c', 'f5bc25', 'f99221',
        '580d8c', '001970', '0a2399', '0b7477', '0b6b50', 'b67e11', 'b85d0d',
    ];
    @Output() public color$: EventEmitter<any> = new EventEmitter<any>();
    private isOpen: boolean = false;

    constructor(private language: language) {
    }

    private pickColor(color) {
        this.color$.emit('#' + color);
        this.isOpen = false;
    }
}
