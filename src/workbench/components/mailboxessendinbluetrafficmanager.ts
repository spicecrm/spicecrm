/**
 * @module WorkbenchModule
 */
import {Component,Injector} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailboxes-sendinblue-traffic-manager",
    templateUrl: "../templates/mailboxessendinbluetrafficmanager.html",
})
export class MailboxesSendinblueTrafficManager {

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
                api_key: "",
                sender_name: "",
                sender_address: "",
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
