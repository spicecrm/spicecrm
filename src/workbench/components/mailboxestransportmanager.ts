/**
 * @module WorkbenchModule
 */
import {Component} from "@angular/core";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: "mailboxes-transport-manager",
    templateUrl: "../templates/mailboxestransportmanager.html",
})

export class MailboxesTransportManager {
    constructor(
        public metadata: metadata,
        public language: language,
        public model: model,
        public view: view,
        public configuration: configurationService
    ) {

    }

    get transportcomponent() {
        let transportValue = this.model.getField('transport');
        if (!transportValue) return undefined;
        let transports = this.configuration.getData('mailboxtransports');
        let transport = transports.find(t => t.name == transportValue);
        if (transport) return transport.component;
        return undefined;
    }
}
