import {Component, EventEmitter} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    templateUrl: './src/modules/calendar/templates/calendaraddcalendar.html',
})
export class CalendarAddCalendar {

    public calendars: any[] = [];
    addCalendar: EventEmitter<any> = new EventEmitter<any>();
    private self: any = {};

    constructor(private language: language, private backend: backend) {
    }

    getIcon(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[1] : icon;
    }

    getSprite(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[0] : 'standard';
    }

    close() {
        this.addCalendar.emit(false);
        this.self.destroy();
    }

    save(calendar) {
        this.addCalendar.emit(calendar);
        this.self.destroy();
    }
}
