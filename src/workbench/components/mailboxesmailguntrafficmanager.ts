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
    templateUrl: "./src/workbench/templates/mailboxesmailguntrafficmanager.html",
})
export class MailboxesMailgunTrafficManager {

    constructor(
        private language: language,
        private injector: Injector,
        private model: model,
        private modal: modal,
        private view: view
    ) {
        let settings = this.model.getField('settings')
        if (!settings || (settings && settings.length == 0)) {
            this.model.data.settings = {
                api_key: "",
                domain: "",
                imap_pop3_display_name: "",
                imap_pop3_username: "",
                reply_to: "",
                region: "",
            };
        }
    }

    /**
     * open the test modal and send a test message
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.injector);
    }
}
