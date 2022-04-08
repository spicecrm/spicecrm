/**
 * @module ModuleUsers
 */
import {Component, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {session} from "../../../services/session.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

@Component({
    templateUrl: "../templates/userdeactivatebutton.html"
})

/**
 * an actionset button to deactivate a user or activate the user again
 */
export class UserDeactivateButton {

    constructor(public language: language, public modal: modal, public model: model, public session: session, public injector: Injector, public backend: backend, public toast: toast) {
    }

    /**
     * only allow active subscribers and not the admin to be disabled
     */
    get disabled() {
        return this.session.isAdmin && this.model.id != '1' ? false : true;
    }

    /**
     * execute the action
     */
    public execute() {
        if (this.model.getField('status') == 'Active') {
            this.modal.openModal("UserDeactivateModal", true, this.injector);
        } else {
            this.modal.prompt('confirm', this.language.getLabel('MSG_ACTIVATE_USER', '', 'long'), this.language.getLabel('MSG_ACTIVATE_USER')).subscribe(
                res => {
                    if (res) {
                        let spinner = this.modal.await(this.language.getLabel('LBL_ACTIVATING'));
                        this.backend.postRequest(`module/Users/${this.model.id}/activate`).subscribe(
                            res => {
                                this.model.getData();
                                spinner.emit(true);
                            },
                            err => {
                                spinner.emit(true);
                                this.toast.sendToast('an Error occured deactivating the User', 'error');
                            }
                        );
                    }
                }
            );
        }
    }

    /**
     * get the action label
     */
    get actionLabel() {
        return this.model.getField('status') == 'Active' ? 'LBL_DEACTIVATE' : 'LBL_ACTIVATE';
    }
}
