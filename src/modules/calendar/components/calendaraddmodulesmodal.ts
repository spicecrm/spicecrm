/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, Component, EventEmitter} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from "../services/calendar.service";

/**
 * Displays a modal with a list of possible modules to add calendar event.
 */
@Component({
    templateUrl: '../templates/calendaraddmodulesmodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarAddModulesModal {
    /**
     * emit the selected module when
     */
    public module$ = new EventEmitter<any>();
    /**
     * reference of this component to be destroyed
     */
    public self: any = {};

    constructor(public language: language, public calendar: calendar) {
    }

    /**
     * close the modal and emit false
     */
    public close() {
        this.module$.emit(false);
        this.self.destroy();
    }

    /**
     * emit the selected module and close the modal
     * @param module
     */
    public save(module) {
        this.module$.emit(module);
        this.self.destroy();
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    public trackByFn(index, item) {
        return item.id;
    }
}
