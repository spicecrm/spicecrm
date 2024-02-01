/**
 * @module ModuleEmails
 */

import {Component, EventEmitter, Output} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import { toast } from '../../../services/toast.service';
import { language } from '../../../services/language.service';
import {configurationService} from "../../../services/configuration.service";

/**
 * this renders a button as part of an actionset to send an email
 *
 */
@Component({
    selector: "email-send-button",
    templateUrl: "../templates/emailsendbutton.html"
})
export class EmailSendButton {
    // public object_module_name: string;
    public actionconfig; // can be set inside actionsets...
    @Output() public actionemitter = new EventEmitter();

    /**
     * inidcates that we are sending
     */
    public sending: boolean = false;

    constructor(
        public model: model,
        public metadata: metadata,
        public modal: modal,
        public toast: toast,
        public language: language,
        public configuration: configurationService
    ) {

    }

    /**
     * a getter that returns the disabled status. This getter checks if all data are available
     */
    get disabled() {
        let recipientAddresses = this.model.getFieldValue('recipient_addresses');
        let mailbox = this.model.getFieldValue('mailbox_id');
        let key = ['outbound', 'outboundsingle', 'outboundmass'];
        let mailboxData =[];
        key.forEach((k) => {
            if(this.configuration.getData('mailboxes'+k) != false){
                mailboxData = (this.configuration.getData('mailboxes'+k));
            }
        });
        const selectedMailboxData = mailboxData.find(id => id.value == mailbox);
        let sizeTooBig = !!this.model.getFieldValue('attachments_size') ? this.model.getFieldValue('attachments_size') > selectedMailboxData.max_upload : false;
        let name = this.model.getFieldValue('name');
        let body = this.model.getFieldValue('body');
        let recipientTo = recipientAddresses ? recipientAddresses.find(re => re.address_type == 'to') : undefined;

        return (!name || !body || !mailbox || !recipientAddresses || !recipientTo || sizeTooBig) ? true : this.sending;
    }


    /**
     * the method invoed when selecting the action. It sends the email
     */
    public execute() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;
            this.model.setFields({
                type: 'out',
                to_be_sent: true,
                from_addr: this.model.getField('from_addr_name'),
                to_addrs: this.model.getField('to_addrs_names'),
                cc_addrs: this.model.getField('cc_addrs_names')
            });

            this.model.save().subscribe( {
                next: () => {
                    modalRef.instance.self.destroy();
                    // emit that the email has been sent
                    this.actionemitter.emit( 'emailsent' );
                },
                error: err => {
                    modalRef.instance.self.destroy();
                    this.toast.sendToast( this.language.getLabel( 'LBL_ERROR_SENDING_EMAIL' ), 'error', err.error.error.lbl ? this.language.getLabel( err.error.error.lbl ) : err.error.error.message );
                    this.sending = false;
                }
            });
        });
    }
}
