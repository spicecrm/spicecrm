/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'object-action-mail-modal',
    templateUrl: '../templates/objectactionmailmodal.html',
    providers: [view, model]
})
export class ObjectActionMailModal implements OnInit {

    /**
     * the parent
     */
    @Input() public parent: any = null;

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
    @Input() public titlelabel: string = 'LBL_BEANTOMAIL';

    /**
     * an event emitter when the email ahs been sent and the modal window will destroy itself
     */
    @Output() public mailsent: EventEmitter<boolean> = new EventEmitter<boolean>();

    public fieldset: string;

    constructor(public language: language,
                public metadata: metadata,
                public model: model,
                public view: view,
                public backend: backend,
                public prefs: userpreferences,
                public modal: modal) {

        // initialize the model and the view
        this.model.module = 'Emails';
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the fieldset
        let componentconfig = this.metadata.getComponentConfig('ObjectActionMailModal');
        this.fieldset = componentconfig.fieldset;
    }

    /**
     * initialize the model and try to get the parent data
     */
    public ngOnInit() {
        this.model.initializeModel(this.parent);
        this.setParentData();
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
     * sets the data from the parent
     */
    public setParentData() {
        this.model.setField('parent_type', this.parent.module);
        this.model.setField('parent_id', this.parent.id);
        this.model.setField('parent_name', this.parent.data.summary_text);
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * send the email
     */
    public sendEmail() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SENDING';

            this.sending = true;

            this.model.setFields({
                type: 'out',
                to_be_sent: '1',
                from_addr: this.model.getField('from_addr_name'),
                to_addrs: this.model.getField('to_addrs_names')
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
}
