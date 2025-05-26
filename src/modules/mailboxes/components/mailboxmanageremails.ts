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
    templateUrl: '../templates/mailboxmanageremails.html',
    standalone: false
})
export class MailboxManagerEmails {

    constructor(
        public mailboxesEmails: mailboxesEmails
    ) {
    }

    /**
     * trackby function to opütimize performnce onm the for loop
     *
     * @param index
     * @param item
     */
    public trackbyfn(index, item) {
        return item.id;
    }

    /**
     * load more if the scroll position reached the bottom
     */
    public loadmore(scrollContainer: HTMLElement) {
        if (scrollContainer.scrollTop + scrollContainer.clientHeight + 50 > scrollContainer.scrollHeight) {
            this.mailboxesEmails.loadMore();
        }
    }
}
