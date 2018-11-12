import {Component} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "./src/modules/users/templates/useraddbutton.html"
})

export class UserAddButton {

    public disabled: boolean = true;

    constructor(private modal: modal, private language: language, private model: model, private session: session) {
        if (this.session.isAdmin) this.disabled = false;
    }

    private execute() {
        this.modal.openModal("UserAddModal");
    }
}