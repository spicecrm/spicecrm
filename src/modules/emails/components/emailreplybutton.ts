/**
 * @module ModuleEmails
 */

import {Component, EventEmitter, Output, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

/**
 * this renders a button as part of an actionset that allows
 *
 * - module: the module name of the object that ahosul be created
 * - checklink: the link in the module pointing towards the component. If this is set the component will check if there are object already linked with that module on that link. And if so disable the button
 */
@Component({
    selector: "email-reply-button",
    templateUrl: "./src/modules/emails/templates/emailreplybutton.html",
    providers: [relatedmodels]
})
export class EmailReplyButton {
    // private object_module_name: string;
    private actionconfig; // can be set inside actionsets...
    @Output() public actionemitter = new EventEmitter();

    constructor(
        private language: language,
        private model: model,
        private metadata: metadata,
        private modal: modal,
        private relatedmodels: relatedmodels,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    /**
     * a getter that returns the disabled status. This getter checks if it is allowed for the user to create such a record and if checklink is set in the actionconfig if a record already exists
     */
    get disabled() {
        // check ACL if we can crate such an object at all
        if (!this.metadata.checkModuleAcl('Emails', 'create')) return true;
        if (this.actionconfig.checklink) {
            if (this.relatedmodels.isloading) return true;

            if (this.relatedmodels.count > 0) {
                return true;
            }
        }

        return false;
    }


    /**
     * the method invoed when selecting the action. This triggers opening a modal window for the email composition
     */
    public execute() {
        this.modal.openModal('EmailReplyModal', true, this.viewContainerRef.injector)
            .subscribe(ref => ref.instance.parent = this.model);
    }


}
