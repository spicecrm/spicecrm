/**
 * @module ModuleCalendar
 */
import {Component, Input} from "@angular/core";
import {model} from "../../../services/model.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {calendar} from "../services/calendar.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "calendar-event-summary",
    templateUrl: "./src/modules/calendar/templates/calendareventsummary.html",
    styles: [`
        .event_has_dark_color {
            color: #ffffff;
        }
        .event_has_dark_color:hover {
            color: #eeeeee;
        }
    `]

})
export class CalendarEventSummary {
    @Input("hasDarkColor") private hasDarkColor: boolean = true;
    @Input("ismulti") private isMulti: boolean = false;
    @Input("isabsence") private isAbsence: boolean = false;
    @Input("isschedulesheet") private isScheduleSheet: boolean = false;

    constructor(private model: model, private userpreferences: userpreferences, private calendar: calendar) {
    }

    get startHour() {
        return this.model.data.date_start ? moment(this.model.data.date_start).tz(this.calendar.timeZone).format(this.userpreferences.getTimeFormat()) : undefined;
    }

    /*
    * @return class
    */
    private getTextClass() {
        return !this.isScheduleSheet && this.hasDarkColor ? 'event_has_dark_color' : '';
    }
}
