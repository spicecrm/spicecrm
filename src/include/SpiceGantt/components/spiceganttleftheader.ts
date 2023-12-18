import {ChangeDetectorRef, Component, HostListener, ViewChild} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";

@Component({
    selector: 'spice-gantt-left-header',
    templateUrl: '../templates/spiceganttleftheader.html',
})
export class SpiceGanttLeftHeader {
    constructor(public spiceGanttService: SpiceGanttService) {
    }
}