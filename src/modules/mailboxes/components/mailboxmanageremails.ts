/**
 * @module ModuleMailboxes
 */
import {Component} from "@angular/core";
import {mailboxesEmails} from "../services/mailboxesemail.service";

/**
 * the list of emails in the mailbox manager
 */
@Component({
    selector: 'mailbox-manager-emails',
    templateUrl: './src/modules/mailboxes/templates/mailboxmanageremails.html',
})
export class MailboxManagerEmails {

    constructor(
        private mailboxesEmails: mailboxesEmails
    ) {
    }

    /**
     * trackby function to opütimize performnce onm the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }

    /**
     * load more if the scroll position reached the bottom
     */
    private loadmore(scrollContainer: HTMLElement) {
        if (scrollContainer.scrollTop + scrollContainer.clientHeight + 50 > scrollContainer.scrollHeight) {
            this.mailboxesEmails.loadMore();
        }
    }
}
