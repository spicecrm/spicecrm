import {ChangeDetectorRef, Component, HostListener, Input, ViewChild} from "@angular/core";
import {SpiceGanttService} from "../services/spicegantt.service";
import moment from "moment";

@Component({
    selector: 'spice-gantt-task-item',
    templateUrl: '../templates/spicegantttaskitem.html',
})
export class SpiceGanttTaskItem {
    @Input() index: number = 0
    @Input() id = ''
    @Input() name = ''
    @Input() type: string = ''
    @Input() start = ''
    @Input() end: string = ''
    @Input() progress: number = -1
    @Input() expanded = true

    constructor(public spiceGanttService: SpiceGanttService) {
    }

    public get width(): number {
        return this.spiceGanttService.getItemLength(moment(new Date(this.start)), moment(new Date(this.end)))
    }

    public get height(): number {
        return this.spiceGanttService.itemHeight
    }

    public get left(): number {
        return this.spiceGanttService.getItemPosition(moment(new Date(this.start)))
    }

    public get backgroundColor() {
        return 'red'
    }

    public get rowStyle() {
        // return {
        //     'position': 'absolute',
        //     'top': this.height + (this.index * this.height) + 'px',
        //     'left': this.left + 'px',
        //     'width': this.width + 'px',
        //     'height': this.height + 'px',
        //     'border': '1px solid ' + this.backgroundColor,
        //     'border-radius': '5px',
        // }
        return {
            'position': 'relative',
            'width': '100%',
            'height': this.height + 'px',
        }
    }

    public get itemStyle() {
        // return {
        //     'background-color': this.backgroundColor,
        //     'border': '1px solid ' + this.backgroundColor,
        //     'width': this.progress > -1 ? this.progress + '%' : '100%',
        //     'height': '100%'
        // }

        return {
            'position': 'absolute',
            'left': this.left + 'px',
            'width': this.width + 'px',
            'height': '100%',
            'border': '1px solid ' + this.backgroundColor,
        }
    }

    public get labelStyle() {
        return {
            'padding-top': '2px',
            'padding-left': '5px'
        }
    }
}