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
    templateUrl: "./src/workbench/templates/mailboxestwilliotrafficmanager.html",
})
export class MailboxesTwillioTrafficManager {

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
