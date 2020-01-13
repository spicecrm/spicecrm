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
    templateUrl: './src/modules/mailboxes/templates/mailboxmanagertextmessages.html',
})
export class MailboxManagerTextMessages {

    constructor(
        private mailboxesEmails: mailboxesEmails
    ) {}

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
     * loadmore triggered by the tobottom Directive
     */
    private loadmore() {
        this.mailboxesEmails.loadMore();
    }
}
