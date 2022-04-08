/**
 * @module ModuleEmails
 */
import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {session} from "../../../services/session.service";
import {dockedComposer} from "../../../services/dockedcomposer.service";

declare var moment: any;

@Component({
    selector: 'email-reply-modal',
    templateUrl: '../templates/emailreplymodal.html',
    providers: [view, model]
})
export class EmailReplyModal implements OnInit {

    /**
     * reference to the modal window self instance
     */
    public self: any = null;

    /**
     * inidcates that we are sending
     */
    public sending: boolean = false;

    /**
     * the title for the modal window to be displayed
     */
    public titlelabel: string = 'LBL_EMAIL_REPLY';

    /**
     * the reply mode
     *
     * @private
     */
    public mode: 'reply'|'replyall' = 'reply';

    /**
     * an event emitter when the email ahs been sent and the modal window will destroy itself
     */
    @Output() public mailsent: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the component config
     *
     * @private
     */
    public componentconfig: any = {};

    constructor(public language: language,
                public metadata: metadata,
                public model: model,
                @SkipSelf() public parent: model,
                public view: view,
                public prefs: userpreferences,
                public modal: modal,
                public session: session,
                public userpreferences: userpreferences,
                public dockedcomposer: dockedComposer,
    ) {

        // initialize the model and the view
        this.model.module = 'Emails';

        this.view.isEditable = true;
        this.view.setEditMode();

        // get the config of the EmailReplyModal-Component
        this.componentconfig = this.metadata.getComponentConfig("EmailReplyModal", this.model.module);
    }

    /**
     * initialize the model and try to get the parent data
     */
    public ngOnInit() {
        this.model.initializeModel(this.parent);
        this.model.startEdit(false);
        // set the from-addresses to to-addresses and vice versa

        // build the receipient addresses
        let recipient_addresses = [];
        for (let address of this.parent.getField('recipient_addresses')) {
            if (address.address_type == "from") {
                let toaddress = {...address};
                toaddress.address_type = "to";
                toaddress.id = '';
                recipient_addresses.push(toaddress);
            } else if (address.address_type != "from" && address.address_type != "to") {
                let addaddress = {...address};
                addaddress.id = '';
                recipient_addresses.push(addaddress);
            }
        }

        // set the email-history into the body
        this.model.setFields({
            recipient_addresses: recipient_addresses,
            reference_id: this.parent.id,
            name: this.language.getLabel('LBL_RE') + this.parent.getField('name'),
            body: '<br><br><br>' + this.buildHistoryText()
        });
    }


    /**
     * generate the email-history-text and return it
     */
    public buildHistoryText() {

        let datetime = new moment.utc(this.parent.getField('date_sent')).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
        let hdate = datetime ? datetime.format(this.userpreferences.getDateFormat()) : "";
        let htime = datetime ? datetime.format(this.userpreferences.getTimeFormat()) : "";

        let historytext = "";
        historytext += "<br><br>";
        historytext += "<div spicecrm_reply_quote='' class='spicecrm_reply_quote'>";
        historytext += "<div dir='ltr' class='crm_attr'>";
        historytext += "<b>" + this.language.getLabel('LBL_FROM') + ":</b> <a href='mailto:" + this.parent.getField('from_addr') + "'>" + this.parent.getField('from_addr') + "</a>";
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_DATE_SENT') + ":</b> " + hdate + " " + htime;
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_TO') + ":</b> " + this.parent.getField('to_addrs');
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_SUBJECT') + ":</b> " + this.parent.getField('data.name');
        historytext += "<br><br>";
        historytext += "</div>";

        historytext += '<blockquote class="crm_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">';
        historytext += this.parent.getField('body').replace('data-signature=""', '').replace('spicecrm_temp_quote=""', '');
        historytext += '</blockquote>';

        historytext += '</div>';

        return historytext;
    }

    /**
     * check if the send button is disabled
     */
    get isDisabled() {
        let recipientAddresses = this.model.getFieldValue('recipient_addresses');
        let mailbox = this.model.getFieldValue('mailbox_id');
        let name = this.model.getFieldValue('name');
        let body = this.model.getFieldValue('body');
        let recipientTo = recipientAddresses ? recipientAddresses.find(re => re.address_type == 'to') : undefined;

        return (!name || !body || !mailbox || !recipientAddresses || !recipientTo) ? true : this.sending;
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * docks teh reply modal to the composer
     *
     * @private
     */
    public dock() {
        this.dockedcomposer.addComposer(this.model.module, this.model);
        this.close();

    }

    /**
     * send the email
     */
    public sendEmail() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;
            this.model.setFields({
                type: 'outbound',
                to_be_sent: '1',
                from_addr: this.model.getField('from_addr_name'),
                to_addrs: this.model.getField('to_addrs_names'),
                cc_addrs: this.model.getField('cc_addrs_names'),
            });

            this.model.save().subscribe(
                success => {
                    modalRef.instance.self.destroy();
                    // emit that the email has been sent
                    this.mailsent.emit(true);
                    this.close();
                },
                error => {
                    modalRef.instance.self.destroy();
                    this.sending = false;
                }
            );
        });
    }

    /**
     * handles the action from the actionset
     *
     * @param action
     * @private
     */
    public handleaction(action) {
        switch (action) {
            default:
                this.close();
        }
    }
}
