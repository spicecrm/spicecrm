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

/**
 * renders a button allowing admins to rest the password of a user
 */
export class UserResetPasswordButton {

    constructor(private modal: modal, private language: language, private model: model, private session: session, private injector: Injector) {
    }

    /**
     * getter for the disbaled state of the button.
     * Needs tobe an admin and the user needs to be active
     *  also no change of password when the user is set to external authentication only
     */
    get disabled() {
        return this.session.isAdmin && this.model.getField('status') == 'Active' && this.model.getFieldValue('external_auth_only') == false ? false : true;
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
