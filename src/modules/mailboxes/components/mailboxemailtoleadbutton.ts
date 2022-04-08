/**
 * @module ModuleMailboxes
 */
import {Component} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {MailboxEmailToLeadModal} from "./mailboxemailtoleadmodal";

@Component({
    selector: "mailbox-email-to-lead-emailbutton",
    templateUrl: "../templates/mailboxemailtoleadbutton.html",
})
export class MailboxEmailToLeadButton {

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public toast: toast,
    ) {}

    public execute() {
        this.modal.openModal("MailboxEmailToLeadModal").
        subscribe(popup => {
            popup.instance.email = this.model;

        });
    }

}
