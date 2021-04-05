/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/emails/templates/emailreplymodal.html',
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
    private sending: boolean = false;

    /**
     * the title for the modal window to be displayed
     */
    public titlelabel: string = 'LBL_EMAIL_REPLY';

    /**
     * the reply mode
     *
     * @private
     */
    private mode: 'reply'|'replyall' = 'reply';

    /**
     * an event emitter when the email ahs been sent and the modal window will destroy itself
     */
    @Output() private mailsent: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the component config
     *
     * @private
     */
    private componentconfig: any = {};

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
        this.model.data.recipient_addresses = [];

        for (let address of this.parent.data.recipient_addresses) {
            if (address.address_type == "from") {
                let toaddress = {...address};
                toaddress.address_type = "to";
                this.model.data.recipient_addresses.push(toaddress);
            } else if (address.address_type != "from" && address.address_type != "to") {
                let addaddress = {...address};
                this.model.data.recipient_addresses.push(addaddress);
            }
        }

        // set the email-history into the body
        this.model.setFields({
            name: this.language.getLabel('LBL_RE') + this.parent.getField('name'),
            body: '<br><br><br>' + this.buildHistoryText()
        });
    }


    /**
     * generate the email-history-text and return it
     */
    public buildHistoryText() {

        let datetime = new moment.utc(this.parent.data.date_sent).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
        let hdate = datetime ? datetime.format(this.userpreferences.getDateFormat()) : "";
        let htime = datetime ? datetime.format(this.userpreferences.getTimeFormat()) : "";

        let historytext = "";
        historytext += "<div class='spicecrm_quote'>";
        historytext += "<div dir='ltr' class='crm_attr'>";
        historytext += "<b>" + this.language.getLabel('LBL_FROM') + ":</b> <a href='mailto:" + this.parent.data.from_addr + "'>" + this.parent.data.from_addr + "</a>";
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_DATE_SENT') + ":</b> " + hdate + " " + htime;
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_TO') + ":</b> " + this.parent.data.to_addrs;
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_SUBJECT') + ":</b> " + this.parent.data.name;
        historytext += "<br><br>";
        historytext += "</div>";

        historytext += '<blockquote class="crm_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">';
        historytext += this.parent.data.body;
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
    private close() {
        this.self.destroy();
    }

    /**
     * docks teh reply modal to the composer
     *
     * @private
     */
    private dock() {
        this.dockedcomposer.addComposer(this.model.module, this.model);
        this.close();

    }

    /**
     * send the email
     */
    private sendEmail() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;
            this.model.setField('type', 'outbound');
            this.model.setField('to_be_sent', '1');
            this.model.setField('from_addr', this.model.data.from_addr_name);
            this.model.setField('to_addrs', this.model.data.to_addrs_names);
            this.model.setField('cc_addrs', this.model.data.cc_addrs_names);

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
    private handleaction(action) {
        switch (action) {
            default:
                this.close();
        }
    }
}
