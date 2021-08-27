/**
 * @module ModuleUsers
 */
import {Component, Input} from "@angular/core";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";

/**
* @ignore
*/
declare var _: any;

@Component({
    selector: "system-preferences-panel-item",
    templateUrl: "./src/systemcomponents/templates/systempreferencespanelitem.html"
})
export class SystemPreferencesPanelItem {

    @Input() private itemlabel: string = '';

    constructor(private view: view, private language: language) {
    }

}
