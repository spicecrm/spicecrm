/**
 * @module WorkbenchModule
 */
import {Component, OnInit} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailbox-folders-modal",
    templateUrl: "../templates/mailboxesewsselectfoldersmodal.html",
})
export class MailboxesEWSSelectFoldersModal {
    public self; // needed for selfdestruction... will be set on creation...

    public mailboxes: any[] = [];

    constructor(
        public language: language,
        public model: model,
    ) {

    }

    public setMailboxes(mailboxes) {
        this.mailboxes = mailboxes;
    }

    get mailbox() {
        try {
            return this.model.getField('settings').ews_folder.id;
        } catch (e) {
            return '';
        }
    }

    set mailbox(id) {
        let ewsSettings = this.model.getField('settings')
        ewsSettings.ews_folder = this.mailboxes.find(mailbox => mailbox.id == id);
        this.model.setField('settings', ewsSettings);
    }

    public close() {
        this.self.destroy();
    }
}
