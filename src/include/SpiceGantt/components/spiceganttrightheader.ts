import {ChangeDetectorRef, Component, HostListener, ViewChild} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";

@Component({
    selector: 'spice-gantt-right-header',
    templateUrl: '../templates/spiceganttrightheader.html',
})
export class SpiceGanttRightHeader {
    constructor(public spiceGanttService: SpiceGanttService) {
    }
}