/**
 * @module WorkbenchModule
 */
import {Component, OnInit} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailbox-folders-modal",
    templateUrl: "./src/workbench/templates/mailboxesimapsmtpselectfoldersmodal.html",
})
export class MailboxesIMAPSMTPSelectFoldersModal{
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

    public close() {
        this.self.destroy();
    }
}