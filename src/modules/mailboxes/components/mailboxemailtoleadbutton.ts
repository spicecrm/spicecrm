import {Component, HostBinding, Input} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {MailboxEmailToLeadModal} from "./mailboxemailtoleadmodal";

@Component({
    selector: "mailbox-email-to-lead-emailbutton",
    host: {
        "(click)" : "createLead()",
        "class": "slds-button slds-button--neutral",
    },
    styles: [
        ":host {cursor:pointer;}",
    ],
    templateUrl: "./src/modules/mailboxes/templates/mailboxemailtoleadbutton.html",
})
export class MailboxEmailToLeadButton {

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private toast: toast,
    ) {}

    public createLead() {
        this.modal.openModal("MailboxEmailToLeadModal").
        subscribe(popup => {
            popup.instance.email = this.model;

        });
    }

}