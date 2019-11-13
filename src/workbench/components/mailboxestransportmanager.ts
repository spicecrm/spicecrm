/**
 * @module WorkbenchModule
 */
import {Component} from "@angular/core";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailboxes-transport-manager",
    templateUrl: "./src/workbench/templates/mailboxestransportmanager.html",
})

export class MailboxesTransportManager {
    constructor(
        private metadata: metadata,
        private language: language,
        private model: model,
        private view: view,
    ) {

    }
}
