/**
 * @module WorkbenchModule
 */
import {Component, OnInit} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailbox-folders-modal",
    templateUrl: "./src/workbench/templates/mailboxesewsselectfoldersmodal.html",
})
export class MailboxesEWSSelectFoldersModal {
    public self; // needed for selfdestruction... will be set on creation...

    private mailboxes: any[] = [];

    constructor(
        private language: language,
        public model: model,
    ) {

    }

    public setMailboxes(mailboxes) {
        this.mailboxes = mailboxes;
    }

    get mailbox() {
        try {
            return this.model.data.settings.ews_folder.id;
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