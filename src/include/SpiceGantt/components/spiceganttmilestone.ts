import {AfterContentInit, AfterViewInit, Component, ContentChildren, Input, QueryList} from "@angular/core";
import {SpiceGanttItem} from "./spiceganttitem";
import {SpiceGanttService} from "../services/spicegantt.service";

@Component({
    selector: 'spice-gantt-milestone',
    templateUrl: '../templates/spiceganttmilestone.html',
})
export class SpiceGanttMilestone {
    @Input() public id = ''
    @Input() public name = ''
    @Input() public date = ''
}