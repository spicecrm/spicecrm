/**
 * @module ModuleUsers
 */
import {Component, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";
import {model} from "../../../services/model.service";

@Component({
    templateUrl: "./src/modules/users/templates/userdeactivatebutton.html"
})

/**
 * an actionset button to deactivate a user
 */
export class UserDeactivateButton {

    constructor(private modal: modal, private model: model, private session: session, private injector: Injector) {
    }

    /**
     * only allow active subscribers and not the admin to be disabled
     */
    get disabled() {
        return this.session.isAdmin && this.model.id != '1' && this.model.getField('status') == 'Active' ? false : true;
    }

    /**
     * execute the action
     */
    private execute() {
        this.modal.openModal("UserDeactivateModal", true, this.injector);
    }
}
