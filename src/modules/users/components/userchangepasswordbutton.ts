import {Component, Input, ElementRef} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {UserChangePasswordModal} from "./userchangepasswordmodal";

@Component({
    selector: "user-change-password-button",
    templateUrl: "./src/modules/users/templates/userchangepasswordbutton.html"
})
export class UserChangePasswordButton {

    constructor(private language: language, private modal: modal) {

    }

    private execute() {
        this.modal.openModal("UserChangePasswordModal");
    }

}