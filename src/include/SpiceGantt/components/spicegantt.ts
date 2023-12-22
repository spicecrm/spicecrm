import {AfterContentInit, AfterViewInit, Component, ContentChildren, Input, QueryList} from "@angular/core";
import {SpiceGanttItem} from "./spiceganttitem";
import {SpiceGanttService} from "../services/spicegantt.service";
import {SpiceGanttMilestone} from "./spiceganttmilestone";
import {model} from "../../../services/model.service";

@Component({
    selector: 'spice-gantt',
    templateUrl: '../templates/spicegantt.html',
    providers: [SpiceGanttService, model]
})
export class SpiceGantt implements AfterContentInit {
    @ContentChildren(SpiceGanttItem) public itemList: QueryList<SpiceGanttItem>;
    @ContentChildren(SpiceGanttMilestone) public milestoneList: QueryList<SpiceGanttMilestone>;

    private _items = []
    private _milestones = []

    @Input() set items(items) {
        this._items = this.spiceGanttService.buildTree(items)
    }

    @Input() set milestones(milestones) {
        this._milestones = milestones
    }

    @Input() set zoomLevel(zoomLevel: string) {
        this.spiceGanttService.zoomLevel = zoomLevel
    }

    get zoomLevel() {
        return this.spiceGanttService.zoomLevel
    }

    get items() {
        return this._items
    }

    get milestones() {
        return this._milestones
    }

    constructor(public spiceGanttService: SpiceGanttService) {

    }

    public ngAfterContentInit() {
        this.itemList.forEach(item => {
            this.spiceGanttService.addItem({
                parent: '',
                level: 0,
                id: item.id,
                name: item.name ?? '',
                type: item.type,
                start: item.start,
                end: item.end,
                progress: item.progress ?? -1,
                expanded: item.expanded,
            })

            item.getNestedItems(item.id)
        });

        this.milestoneList.forEach(milestone => {
            this.spiceGanttService.addMilestone({
                id: milestone.id,
                name: milestone.name,
                date: milestone.date
            })
        })
    }
}