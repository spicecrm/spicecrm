import {AfterContentInit, AfterViewInit, Component, ContentChildren, Input, QueryList} from "@angular/core";
import {SpiceGanttItem} from "./spiceganttitem";
import {SpiceGanttService} from "../services/spicegantt.service";
import moment from "moment";

@Component({
    selector: 'spice-gantt-moment-label',
    templateUrl: '../templates/spiceganttmomentlabel.html',
})
export class SpiceGanttMomentLabel {
    @Input() public type = ''
    @Input() public date: moment.Moment = moment()

    get label() {
        switch (this.type) {
            case 'years':
                return this.date.format('YYYY')
            case 'quarters':
                return 'Q' + this.date.format('Q') + '(' + this.date.format('YYYY') + ')'
            case 'months':
                return this.date.format('MMM')
            case 'weeks':
                return this.date.format('MMM, YYYY') + ' (W' + this.date.format('ww') + ')'
            case 'days':
                return this.date.format('DD')
            case 'hours':
                return this.date.format('HH')
            case 'minutes':
                return this.date.format('mm')
        }
    }
}