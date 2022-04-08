/**
 * @module ModuleUsers
 */
import {Component, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "../templates/userresetpasswordbutton.html"
})

/**
 * renders a button allowing admins to rest the password of a user
 */
export class UserResetPasswordButton {

    constructor(public modal: modal, public language: language, public model: model, public session: session, public injector: Injector) {
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
    public execute() {
        if (!this.session.isAdmin) {
            return;
        }
        this.modal.openModal("UserResetPasswordModal", true, this.injector);
    }
}
