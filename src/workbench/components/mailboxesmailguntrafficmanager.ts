/**
 * @module WorkbenchModule
 */
import {Component, Injector} from "@angular/core";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";

/**
 * renders the config component for the mailgun transport handler
 */
@Component({
    selector: "mailboxes-mailgun-traffic-manager",
    templateUrl: "../templates/mailboxesmailguntrafficmanager.html",
})
export class MailboxesMailgunTrafficManager {

    constructor(
        public language: language,
        public injector: Injector,
        public model: model,
        public modal: modal,
        public view: view
    ) {
        let settings = this.model.getField('settings')
        if (!settings || (settings && settings.length == 0)) {
            this.model.setField('settings', {
                api_key: "",
                domain: "",
                imap_pop3_display_name: "",
                imap_pop3_username: "",
                reply_to: "",
                region: "",
            });
        }
    }

    /**
     * open the test modal and send a test message
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.injector);
    }
}
