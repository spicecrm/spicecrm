import {Component, Renderer2, ViewChild, ViewContainerRef, Input} from "@angular/core";
import {model} from "../../../services/model.service";

declare var moment: any;

@Component({
    selector: "calendar-event-summary",
    templateUrl: "./src/modules/calendar/templates/calendareventsummary.html"

})
export class CalendarEventSummary {

    @ViewChild("popuplink", {read: ViewContainerRef}) private popupLink: ViewContainerRef;
    @Input("ismulti") private isMulti: boolean = false;
    private showPopover: boolean = false;
    private mouseIn: boolean = false;
    private clickListener: any = undefined;

    constructor(private model: model, private renderer: Renderer2) {
        this.clickListener = this.renderer.listen("document", "click", (e) => {
            if (e.target == this.popupLink.element.nativeElement) {
                this.showPopover = true;
            } else if (!this.mouseIn && this.showPopover) {
                this.showPopover = false;
            }
        });
    }

    get startHour() {
        return this.model.data.date_start ? moment(this.model.data.date_start).tz(moment.tz.guess()).add(moment().utcOffset(), 'm').format("HH:mm") : "00:00";
    }
}
