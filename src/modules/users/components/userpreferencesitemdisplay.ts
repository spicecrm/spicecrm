/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {view} from "../../../services/view.service";

/**
* @ignore
*/
declare var _: any;

@Component({
    selector: "user-preferences-item-display",
    templateUrl: "./src/modules/users/templates/userpreferencesitemdisplay.html",
    styles: [
        `.slds-button--icon {
            color: #eeeeee
        }

        .slds-button--icon:hover {
            color: #5B5B5B
        }`
    ]
})
export class UserPreferencesItemDisplay {
    constructor(private view: view) {
    }
}
