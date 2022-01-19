/**
 * @module ModuleCalendar
 */
import {Component, EventEmitter} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    templateUrl: '../templates/calendaraddcalendar.html',
})
export class CalendarAddCalendar {

    public calendars: any[] = [];
    public addCalendar: EventEmitter<any> = new EventEmitter<any>();
    public self: any = {};

    constructor(public language: language, public backend: backend) {
    }

    public getIcon(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[1] : icon;
    }

    public getSprite(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[0] : 'standard';
    }

    public close() {
        this.addCalendar.emit(false);
        this.self.destroy();
    }

    public save(calendar) {
        this.addCalendar.emit(calendar);
        this.self.destroy();
    }

    public trackByFn(index, item) {
        return item.id;
    }
}
