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
    templateUrl: "../templates/mailboxesa1smstrafficmanager.html",
})
export class MailboxesA1SmsTrafficManager {

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public view: view,
        public injector: Injector
    ) {
        let settings = this.model.getField('settings');
        if (!settings || (settings && settings.length == 0)) {
            this.model.setField('settings',  {
                a1_username: "",
                a1_password: "",
                a1_sender: "",
            });
        }
    }

    /**
     * test the connection
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.injector );
    }
}
