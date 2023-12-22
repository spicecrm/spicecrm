import {ChangeDetectorRef, Component, HostListener, ViewChild} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";

@Component({
    selector: 'spice-gantt-right-body',
    templateUrl: '../templates/spiceganttrightbody.html',
})
export class SpiceGanttRightBody {
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.timelineContainerWasResized();
    }

    @ViewChild('timelinecontainer') timelineContainer: any;

    constructor(public spiceGanttService: SpiceGanttService) {
    }

    ngAfterViewInit(): void {
        this.timelineContainerWasResized()
    }

    timelineContainerWasResized(): void {
        this.spiceGanttService.containerWidth = this.timelineContainer.nativeElement.offsetWidth;
    }
}