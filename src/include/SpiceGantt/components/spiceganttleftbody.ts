import {ChangeDetectorRef, Component, HostListener, ViewChild} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";
import moment from "moment";

@Component({
    selector: 'spice-gantt-left-body',
    templateUrl: '../templates/spiceganttleftbody.html',
})
export class SpiceGanttLeftBody {
    constructor(public spiceGanttService: SpiceGanttService) {
    }
}