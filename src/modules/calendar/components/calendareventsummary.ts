import {Component, Input, Renderer2, ViewChild, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {userpreferences} from "../../../services/userpreferences.service";

declare var moment: any;

@Component({
    selector: "calendar-event-summary",
    templateUrl: "./src/modules/calendar/templates/calendareventsummary.html"

})
export class CalendarEventSummary {
    @Input("ismulti") private isMulti: boolean = false;
    @Input("isabsence") private isAbsence: boolean = false;
    constructor(private model: model, private userpreferences: userpreferences) {}

    get startHour() {
        return this.model.data.date_start ? moment(this.model.data.date_start).tz(moment.tz.guess())
            .add(moment().utcOffset(), 'm').format(this.userpreferences.getTimeFormat()) : undefined;
    }
}
