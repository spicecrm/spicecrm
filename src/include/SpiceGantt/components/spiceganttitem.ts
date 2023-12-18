import {AfterContentInit, Component, ContentChildren, Input, QueryList} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";

@Component({
    selector: 'spice-gantt-item',
    templateUrl: '../templates/spiceganttitem.html',
})

export class SpiceGanttItem {
    @ContentChildren(SpiceGanttItem) public selectItemlist: QueryList<SpiceGanttItem>;

    @Input() public parent: string = ''
    @Input() public id: string = '';
    @Input() public name: string = '';
    @Input() public type: string = '';
    @Input() public start: string = '';
    @Input() public end: string = '';
    @Input() public progress: number = -1;
    @Input() public items = [];
    @Input() public expanded: boolean = true;

    constructor(public spiceGanttService: SpiceGanttService) {

    }

    public getNestedItems(from: string = null, level = 0) {
        const nextLevel = level + 1
        this.selectItemlist.forEach(item => {
            this.spiceGanttService.addItem({
                parent: from,
                level: nextLevel,
                id: item.id,
                name: item.name ?? '',
                type: item.type,
                start: item.start,
                end: item.end,
                progress: item.progress ?? -1,
                expanded: item.expanded,
            });

            item.getNestedItems(item.id, nextLevel + 1)
        })
    }
}
