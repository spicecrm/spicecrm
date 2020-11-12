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
import {EmailReplyModal} from "./emailreplymodal";

declare var moment: any;

/**
 * a modal window to forward an email
 */
@Component({
    templateUrl: './src/modules/emails/templates/emailreplymodal.html',
    providers: [view, model]
})
export class EmailForwardModal extends EmailReplyModal {

    /**
     * the title for the modal window to be displayed
     */
    public titlelabel: string = 'LBL_EMAIL_FORWARD';

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
        super(language, metadata, model, parent, view, prefs, modal, session, userpreferences, dockedcomposer);
    }

    /**
     * initialize the model and try to get the parent data
     */
    public ngOnInit() {
        this.model.initializeModel(this.parent);
        this.model.startEdit(false);
        // set the from-addresses to to-addresses and vice versa
        this.model.data.recipient_addresses = [];

        // set the email-history into the body
        this.model.setFields({
            name: this.language.getLabel('LBL_FW') + this.parent.getField('name'),
            body: '<br><br><br>' + this.buildHistoryText()
        });
    }

}
