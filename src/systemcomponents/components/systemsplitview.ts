/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";

/**
 * a simple container that renders a split view with two componentsets rendered
 */
@Component({
    selector: "system-split-view",
    templateUrl: "../templates/systemsplitview.html"
})
export class SystemSplitView {
    @Input() public componentconfig: any = {};

    get componentSetLeft() {
        return this.componentconfig.left;
    }

    get componentSetRight() {
        return this.componentconfig.right;
    }
}
