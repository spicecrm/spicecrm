/**
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'campaign-send-test-mail-button',
    templateUrl: '../templates/campaignsendtestmailbutton.html'
})
export class CampaignSendTestMailButton {

    public sending: boolean = false;
    public disabled: boolean = true;

    constructor(public language: language, public model: model, public modal: modal, public backend: backend, public toast: toast) {
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }

    /**
     * renders a modal and sends the test emails
     */
    public execute() {
        let loading = this.modal.await('LBL_SENDING');
        if (!this.sending) {
            this.sending = true;
            this.backend.postRequest(`module/CampaignTasks/${this.model.id}/sendtestmail`).subscribe({
                next: res => {
                    this.sending = false;
                    loading.emit(true);
                    loading.complete();
                    this.toast.sendToast(`${this.language.getLabel('LBL_TEST_MAILS_SENT')} ${res.sent} from ${res.total}`, 'success');
                }, error: (err) => {
                    loading.emit(true);
                    loading.complete();
                    this.sending = false;
                    this.toast.sendToast(err.error.error?.lbl, 'error');
                }
            });
        }
    }

    /**
     * only show for campaign tasks of type email
     */
    get hidden() {
        return !/^Email|SMS$/.test( this.model.getField('campaigntask_type') );
    }

    /**
     * handle the disabled status
     */
    public handleDisabled() {

        // not if editing
        if (!this.model.checkAccess('edit')) {
            this.disabled = true;
            return;
        }

        // mailbox is set
        if (!this.model.getField('mailbox_id')) {
            this.disabled = true;
            return;
        }

        // template is set is set
        /*
        if (!this.model.data.email_template_id) {
            this.disabled = true;
            return;
        }
        */

        // not if editing
        this.disabled = this.model.isEditing ? true : false;
    }
}
