/**
 * @module ModuleUsers
 */
import {Component,} from "@angular/core";
import {view} from "../../../services/view.service";

/**
* @ignore
*/
declare var _: any;

@Component({
    selector: "user-preferences-item-edit",
    templateUrl: "./src/modules/users/templates/userpreferencesitemedit.html"
})
export class UserPreferencesItemEdit {

    constructor(private view: view) {
    }

}
