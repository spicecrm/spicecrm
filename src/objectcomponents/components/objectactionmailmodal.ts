import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'object-action-mail-modal',
    templateUrl: './src/objectcomponents/templates/objectactionmailmodal.html',
    providers: [view]
})
export class ObjectActionMailModal implements OnInit {

    private tplList: any[] = [];
    private fromList: any[] = [];
    private loading: boolean = true;
    private sending: boolean = false;

    public parent: any = null;
    public self: any = null

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private backend: backend, private prefs: userpreferences, private modal: modal) {
        // initialize model
        this.model.module = 'Emails';

        // initialize the View
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.model.initializeModel(this.parent);

        // set the parent data
        this.model.data.parent_type = this.parent.module;
        this.model.data.parent_id = this.parent.id;
        this.model.data.parent_name = this.parent.data.summary_text;
    }

    private close() {
        this.self.destroy();
    }

    get senddisabled() {

        // check mailbox
        if (!this.model.getFieldValue('mailbox_id')) return true;

        // check subjekt and body
        if (!this.model.getFieldValue('name') || !this.model.getFieldValue('body')) return true;

        // check fpor receipients
        if (!this.model.getFieldValue('recipient_addresses')) return true;

        let recipientok = false;
        this.model.data.recipient_addresses.some(recipient => {
            if (recipient.address_type == 'to') {
                recipientok = true;
                return true;
            }
        })

        if (!recipientok) return true;

        return this.sending;

    }

    private sendemail() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;
            this.model.data.type = 'out';
            this.model.data.to_be_sent = '1';
            this.model.data.from_addr = this.model.data.from_addr_name;
            this.model.data.to_addrs = this.model.data.to_addrs_names;
            this.model.save().subscribe(
                success => {
                    modalRef.instance.self.destroy();
                    this.close();
                },
                error => {
                    modalRef.instance.self.destroy();
                    this.sending = false;
                }
            );
        });
    }
}