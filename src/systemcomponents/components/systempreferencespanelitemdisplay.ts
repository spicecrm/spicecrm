/**
 * @module ModuleUsers
 */
import { Component, Input } from "@angular/core";
import {view} from "../../services/view.service";

/**
 * render the display value of a preference with edit button
 */
@Component({
    selector: "system-preferences-panel-item-display",
    templateUrl: "../templates/systempreferencespanelitemdisplay.html",
    styles: [
            `.slds-button--icon {
            color: #eeeeee
        }

        .slds-button--icon:hover {
            color: #5B5B5B
        }`
    ]
})
export class SystemPreferencesPanelItemDisplay {

    @Input() public global = false;

    constructor(public view: view) {
    }

}
