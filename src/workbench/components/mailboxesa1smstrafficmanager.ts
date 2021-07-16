/**
 * @module WorkbenchModule
 */
import {Component, Injector} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";

/**
 * renders the management component for the A1 SMS gateway
 */
@Component({
    selector: "mailboxes-a1sms-traffic-manager",
    templateUrl: "./src/workbench/templates/mailboxesa1smstrafficmanager.html",
})
export class MailboxesA1SmsTrafficManager {

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
        private view: view,
        private injector: Injector
    ) {
        let settings = this.model.getField('settings');
        if (!settings || (settings && settings.length == 0)) {
            this.model.data.settings = {
                a1_username: "",
                a1_password: "",
                a1_sender: "",
            };
        }
    }

    /**
     * test the connection
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.injector );
    }
}
