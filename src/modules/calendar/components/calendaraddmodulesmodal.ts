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
    templateUrl: './src/modules/calendar/templates/calendaraddmodulesmodal.html',
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
    private self: any = {};

    constructor(private language: language, private calendar: calendar) {
    }

    /**
     * close the modal and emit false
     */
    private close() {
        this.module$.emit(false);
        this.self.destroy();
    }

    /**
     * emit the selected module and close the modal
     * @param module
     */
    private save(module) {
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
    private trackByFn(index, item) {
        return item.id;
    }
}
