import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "./src/modules/users/templates/userpopoverheader.html"
})

export class UserPopoverHeader {

    constructor(private language: language, private model: model) {

    }

    get userimage() {
        return this.model.getField('user_image');
    }
}
