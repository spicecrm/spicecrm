/**
 * @module ModuleMailboxes
 */
import {Component} from "@angular/core";
import {navigation} from "../../../services/navigation.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

/**
 * the mailbox manager allowing users to browse throut mailboxes
 */
@Component({
    providers: [mailboxesEmails],
    selector: 'mailbox-manager',
    templateUrl: './src/modules/mailboxes/templates/mailboxmanager.html',
})
export class MailboxManager {
    constructor(
        private navigation: navigation,
        private mailboxesEmails: mailboxesEmails,
    ) {
        this.navigation.setActiveModule('Mailboxes');
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
