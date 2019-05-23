/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "./src/modules/users/templates/userpopoverheader.html",
    providers: [view]
})

export class UserPopoverHeader {

    constructor(private language: language, private view: view, private model: model) {
        this.view.displayLabels = false;
    }

    get userimage() {
        return this.model.getField('user_image');
    }
}
