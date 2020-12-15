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
    templateUrl: "./src/modules/users/templates/userchangepasswordbutton.html"
})
export class UserChangePasswordButton {

    constructor(private language: language, private modal: modal, private model: model) {

    }

    get disabled() {
        return this.model.getFieldValue('external_auth_only') == false;
    }

    private execute() {
        this.modal.openModal("UserChangePasswordModal");
    }

}
