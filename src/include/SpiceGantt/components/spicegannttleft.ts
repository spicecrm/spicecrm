import {ChangeDetectorRef, Component, HostListener, ViewChild} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";

@Component({
    selector: 'spice-gantt-left',
    templateUrl: '../templates/spiceganttleft.html',
})
export class SpiceGanttLeft {
    constructor(public spiceGanttService: SpiceGanttService) {
    }
}