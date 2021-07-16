/**
 * @module WorkbenchModule
 */
import {Component,Injector} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailboxes-sendgrid-traffic-manager",
    templateUrl: "./src/workbench/templates/mailboxessendgridtrafficmanager.html",
})
export class MailboxesSendgridTrafficManager {

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
        private view: view,
        private injector: Injector
    ) {
        let settings = this.model.getField('settings')
        if (!settings || (settings && settings.length == 0)) {
            this.model.data.settings = {
                api_key: "",
                imap_pop3_display_name: "",
                imap_pop3_username: "",
                reply_to: "",
            };
        }
    }

    /**
     * runs a conection test
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.injector );
    }
}
