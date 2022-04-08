/**
 * @module ModuleMailboxes
 */
import {Component, ElementRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

/**
 * the list of textmessages in the mailbox manager
 */
@Component({
    selector: 'mailbox-manager-textmessages',
    templateUrl: '../templates/mailboxmanagertextmessages.html',
})
export class MailboxManagerTextMessages {

    constructor(
        public mailboxesEmails: mailboxesEmails
    ) {}

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
