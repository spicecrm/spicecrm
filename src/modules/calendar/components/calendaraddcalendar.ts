/**
 * @module ModuleCalendar
 */
import {Component, EventEmitter} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    templateUrl: './src/modules/calendar/templates/calendaraddcalendar.html',
})
export class CalendarAddCalendar {

    public calendars: any[] = [];
    private addCalendar: EventEmitter<any> = new EventEmitter<any>();
    private self: any = {};

    constructor(private language: language, private backend: backend) {
    }

    private getIcon(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[1] : icon;
    }

    private getSprite(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[0] : 'standard';
    }

    private close() {
        this.addCalendar.emit(false);
        this.self.destroy();
    }

    private save(calendar) {
        this.addCalendar.emit(calendar);
        this.self.destroy();
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
