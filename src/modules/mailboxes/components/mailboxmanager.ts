/**
 * @module ModuleMailboxes
 */
import {Component} from "@angular/core";
import {navigation} from "../../../services/navigation.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

/**
 * the mailbox manager allowing users to browse throut mailboxes
 */
@Component({
    providers: [mailboxesEmails],
    selector: 'mailbox-manager',
    templateUrl: '../templates/mailboxmanager.html',
})
export class MailboxManager {
    constructor(
        public navigation: navigation,
        public navigationtab: navigationtab,
        public mailboxesEmails: mailboxesEmails,
    ) {
        this.navigationtab.setTabInfo({displayname: 'Mailboxes', displaymodule: 'Mailboxes'});

    }

    /**
     * determines if emails are listed or SMS
     */
    get isEmailMailbox() {
        if (this.mailboxesEmails.activeMailBox && this.mailboxesEmails.activeMailBox.type=='email') {
            return true;
        }
        return false;
    }
}
