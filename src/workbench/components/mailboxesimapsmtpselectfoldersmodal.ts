/**
 * @module WorkbenchModule
 */
import {Component, OnInit} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailbox-folders-modal",
    templateUrl: "../templates/mailboxesimapsmtpselectfoldersmodal.html",
})
export class MailboxesIMAPSMTPSelectFoldersModal{
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

    public close() {
        this.self.destroy();
    }
}
