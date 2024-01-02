import {ChangeDetectorRef, Component, HostListener, ViewChild} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";

@Component({
    selector: 'spice-gantt-right',
    templateUrl: '../templates/spiceganttright.html',
})
export class SpiceGanttRight {
    constructor(public spiceGanttService: SpiceGanttService) {
    }
}