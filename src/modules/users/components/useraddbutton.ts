import {Component} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "./src/modules/users/templates/useraddbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
        "(click)": "addUser()"
    },
    styles: [
        ":host >>> {cursor:pointer;}"
    ]
})

export class UserAddButton {

    constructor(private modal: modal, private language: language, private model: model) {}

    private addUser() {
        this.modal.openModal("UserAddModal");
    }
}