/**
 * @module ModuleEmails
 */

import {Component, EventEmitter, Output, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";

/**
 * this renders a button as part of an actionset that renders a reply button to create an email forward modal
 */
@Component({
    templateUrl: "../templates/emailforwardbutton.html"
})
export class EmailForwardButton {
    /**
     * set as part when the acitonset renders
     *
     * @private
     */
    public actionconfig;

    constructor(
        public injector: Injector,
        public model: model,
        public metadata: metadata,
        public modal: modal,
    ) {

    }

    /**
     * a getter that returns the disabled status. This getter checks if it is allowed for the user to create an email
     */
    get disabled() {
        // check ACL if we can create an email
        if (!this.metadata.checkModuleAcl('Emails', 'create')) return true;

        return false;
    }


    /**
     * the method invoed when selecting the action. This triggers opening a modal window for the email composition
     */
    public execute() {
        this.modal.openModal('EmailForwardModal', true, this.injector);
    }


}
