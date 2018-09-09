import {Component, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {Subject} from "rxjs";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {navigation} from "../../../services/navigation.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

@Component({
    selector: 'mailbox-manager-header',
    templateUrl: './app/modules/mailboxes/templates/mailboxmanagerheader.html',
})
export class MailboxManagerHeader {

    private mailboxselection: string;
    private emailopenness: string = "";

    constructor(
        private language: language,
        private mailboxesEmails: mailboxesEmails,
    ) {}

    private selectMailbox() {
        this.mailboxesEmails.activeMailBox = {};
        for (let mailbox of this.mailboxesEmails.mailboxes) {
            if (mailbox.id === this.mailboxselection) {
                this.mailboxesEmails.activeMailBox = mailbox;
            }
        }
        this.mailboxesEmails.loadMails();
    }

    private selectEmailOpenness() {
        this.mailboxesEmails.emailopenness = this.emailopenness;
        this.mailboxesEmails.loadMails();
    }

    get buttonenabled() {
        return this.mailboxesEmails.activeMailBox && !this.mailboxesEmails.isLoading ? true : false;
    }

    private reloadList() {
        this.mailboxesEmails.loadMails();
    }

    private fetchEmails() {
        this.mailboxesEmails.fetchEmails();
    }

}
