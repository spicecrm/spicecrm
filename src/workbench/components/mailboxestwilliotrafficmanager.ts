/**
 * @module WorkbenchModule
 */
import {Component, Injector} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";

/**
 * renders the management component for the Twilio SMS gateway
 */
@Component({
    selector: "mailboxes-twillio-traffic-manager",
    templateUrl: "../templates/mailboxestwilliotrafficmanager.html",
})
export class MailboxesTwillioTrafficManager {

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public view: view,
        public injector: Injector
    ) {
        let settings = this.model.getField('settings')
        if (!settings || (settings && settings.length == 0)) {
            this.model.data.settings = {
                account_sid: "",
                auth_token: "",
                phone_number_from: "",
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
