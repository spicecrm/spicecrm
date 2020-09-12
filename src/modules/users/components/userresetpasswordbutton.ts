/**
 * @module ModuleUsers
 */
import {Component, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "./src/modules/users/templates/userresetpasswordbutton.html"
})

export class UserResetPasswordButton {

    constructor(private modal: modal, private language: language, private model: model, private session: session, private injector: Injector) {
    }

    /**
     * getter for the disbaled state of the button.
     * Needs tobe an admin and the user needs to be active
     */
    get disabled() {
        return this.session.isAdmin && this.model.getField('status') == 'Active' ? false : true;
    }

    /**
     * triger the reset
     */
    private execute() {
        if (!this.session.isAdmin) {
            return;
        }
        this.modal.openModal("UserResetPasswordModal", true, this.injector);
    }
}
