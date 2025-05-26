/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";

@Component({
    selector: "system-trend-indicator",
    templateUrl: "../templates/systemtrendindicator.html",
    standalone: false
})
export class SystemTrendIndicator {
    @Input() public trend: 'neutral'|'down'|'up' = 'neutral';

}

