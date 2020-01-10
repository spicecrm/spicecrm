/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";

@Component({
    selector: "system-trend-indicator",
    templateUrl: "./src/systemcomponents/templates/systemtrendindicator.html"
})
export class SystemTrendIndicator {
    @Input() private trend: 'neutral'|'down'|'up' = 'neutral';

}

