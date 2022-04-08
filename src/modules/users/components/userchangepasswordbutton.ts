/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {UserChangePasswordModal} from "./userchangepasswordmodal";

@Component({
    selector: "user-change-password-button",
    templateUrl: "../templates/userchangepasswordbutton.html"
})
export class UserChangePasswordButton {

    constructor(public language: language, public modal: modal, public model: model) {

    }

    get disabled() {
        return this.model.getFieldValue('external_auth_only') == false;
    }

    public execute() {
        this.modal.openModal("UserChangePasswordModal");
    }

}
