import {Component, Input, ElementRef} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {UserChangePasswordModal} from "./userchangepasswordmodal";

@Component({
    selector: "user-change-password-button",
    templateUrl: "./src/modules/users/templates/userchangepasswordbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
        "(click)": "changePassword()"
    },
    styles: [
        ":host {cursor:pointer;}"
    ]
})
export class UserChangePasswordButton {

    constructor(private language: language, private modal: modal) {

    }

    private changePassword() {
        this.modal.openModal("UserChangePasswordModal");
    }

}