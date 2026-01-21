/**
 * @module ModuleEmails
 */

import {Component, DestroyRef, effect, EventEmitter, Injector, Output} from "@angular/core";
import {configurationService} from "../../../services/configuration.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {
    ProspectListsSetTargetsEmailAddressModal
} from "../../prospectlists/components/prospectlistssettargetsemailaddressmodal";
import {EmailPlanModal} from "./emailplanmodal";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


/**
 * this renders a button as part of an actionset to plan an email
 *
 */
@Component({
    selector: "email-plan-button",
    templateUrl: "../templates/emailplanbutton.html",
    standalone: false
})
export class EmailPlanButton {

    public actionconfig;
    @Output() public actionemitter = new EventEmitter();

    /**
     * inidcates that we are sending
     */
    public canPlan: boolean = false;


    constructor(
        public model: model,
        public configuration: configurationService,
        public modal: modal,
        public injector: Injector,
        public toast: toast,
        public language: language,
        private destroyRef: DestroyRef
    ) {

    }

    get hidden() {
        return this.model.getField('status') != 'draft' && this.model.getField('status') != 'created';
    }

    get disabled() {
        let recipientAddresses = this.model.getFieldValue('recipient_addresses');
        let mailbox = this.model.getFieldValue('mailbox_id');
        let key = ['outbound', 'outboundsingle', 'outboundmass'];
        let mailboxData = [];
        key.forEach((k) => {
            if (this.configuration.getData('mailboxes' + k) != false) {
                mailboxData = (this.configuration.getData('mailboxes' + k));
            }
        });
        let selectedMailboxData = mailboxData.find(id => id.value == mailbox);
        let sizeTooBig = !!this.model.getFieldValue('attachments_size') ? this.model.getFieldValue('attachments_size') > selectedMailboxData.max_upload : false;
        let name = this.model.getFieldValue('name');
        let body = this.model.getFieldValue('body');
        let recipientTo = recipientAddresses ? recipientAddresses.find(re => re.address_type == 'to') : undefined;

        if (this.model.getField('downloadlink_attachments')) {
            sizeTooBig = false;
        }

        return (!name || !body || !mailbox || !recipientAddresses || !recipientTo || sizeTooBig) ? true : this.canPlan;
    }

    public execute() {
        this.modal.openStaticModal(EmailPlanModal, true, this.injector).subscribe(modalRef => {
                modalRef.instance.response.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
                    if (res) {
                        this.model.setFields({
                            type: 'out',
                            status: 'planned',
                            to_be_sent: false,
                            from_addr: this.model.getField('from_addr_name'),
                            to_addrs: this.model.getField('to_addrs_names'),
                            cc_addrs: this.model.getField('cc_addrs_names')
                        });
                        this.model.save().subscribe({
                            next: () => {
                                this.toast.sendToast(this.language.getLabel('LBL_EMAIL_PLANNED'));
                            },
                            error: err => {
                                this.toast.sendToast(this.language.getLabel('LBL_ERROR_SENDING_EMAIL'), 'error', err.error.error.lbl ? this.language.getLabel(err.error.error.lbl) : err.error.error.message);
                            }
                        });
                        this.actionemitter.emit('emailplanned');
                    }
                });
            }
        );
    }
}