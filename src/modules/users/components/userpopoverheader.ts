/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "../templates/userpopoverheader.html",
    providers: [view]
})

export class UserPopoverHeader {

    constructor(public language: language, public view: view, public model: model) {
        this.view.displayLabels = false;
    }

    get userimage() {
        return this.model.getField('user_image');
    }
}
