/**
 * @module ModuleCalendar
 */
import {Component, EventEmitter, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {calendar} from "../services/calendar.service";

@Component({
    templateUrl: './src/modules/calendar/templates/calendaraddmodulesmodal.html',
})
export class CalendarAddModulesModal {

    public module$: EventEmitter<any> = new EventEmitter<any>();
    private self: any = {};

    constructor(private language: language, private calendar: calendar) {
    }

    get modules() {
        return this.calendar.modules;
    }
    private close() {
        this.module$.emit(false);
        this.self.destroy();
    }

    private save(module) {
        this.module$.emit(module);
        this.self.destroy();
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
