/**
 * @module ModuleUsers
 */
import {Component, Input} from "@angular/core";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";

/**
* @ignore
*/
declare var _: any;

@Component({
    selector: "user-preferences-item",
    templateUrl: "./src/modules/users/templates/userpreferencesitem.html"
})
export class UserPreferencesItem {

    @Input() private itemlabel: string = '';

    constructor(private view: view, private language: language) {
    }

}
