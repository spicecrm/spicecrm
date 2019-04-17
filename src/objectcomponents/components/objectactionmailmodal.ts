/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
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
    providers: [view, model]
})
export class ObjectActionMailModal implements OnInit {

    public parent: any = null;
    public self: any = null;
    private sending: boolean = false;

    constructor(private language: language,
                private metadata: metadata,
                private model: model,
                private view: view,
                private backend: backend,
                private prefs: userpreferences,
                private modal: modal) {
        this.model.module = 'Emails';
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    get isDisabled() {
        let recipientAddresses = this.model.getFieldValue('recipient_addresses');
        let mailbox = this.model.getFieldValue('mailbox_id');
        let name = this.model.getFieldValue('name');
        let body = this.model.getFieldValue('body');
        let recipientTo = recipientAddresses ? recipientAddresses.find(re => re.address_type == 'to') : undefined;

        return (!name || !body || !mailbox || !recipientAddresses || !recipientTo) ? true : this.sending;
    }

    public ngOnInit() {
        this.model.initializeModel(this.parent);
        this.setParentData();
    }

    private setParentData() {
        this.model.setField('parent_type', this.parent.module);
        this.model.setField('parent_id', this.parent.id);
        this.model.setField('parent_name', this.parent.data.summary_text);
    }

    private close() {
        this.self.destroy();
    }

    private sendEmail() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;
            this.model.setField('type', 'out');
            this.model.setField('to_be_sent', '1');
            this.model.setField('from_addr', this.model.data.from_addr_name);
            this.model.setField('to_addrs', this.model.data.to_addrs_names);

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