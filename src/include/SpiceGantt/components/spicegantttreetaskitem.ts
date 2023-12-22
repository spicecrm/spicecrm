import {AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";

@Component({
    selector: '[spice-gantt-tree-task-item]',
    templateUrl: '../templates/spicegantttreetaskitem.html',
})

export class SpiceGanttTreeTaskItem {
    @Input() parent: string = ''
    @Input() level: number = 0
    @Input() id: string = ''
    @Input() name: string = ''
    @Input() type: string = ''
    @Input() start: string = ''
    @Input() end: string = ''
    @Input() expanded: boolean = true
    @Input() items: []

    constructor(public spiceGanttService: SpiceGanttService) {
    }

    toggleNode() {
        this.spiceGanttService.setNode(this.id, {
            expanded: !this.expanded
        }, true)
    }

    get isExpandable() {
        return this.spiceGanttService.getChildren(this.id).length > 0
    }
}