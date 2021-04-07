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
    templateUrl: './src/modules/campaigns/templates/campaignsendtestmailbutton.html'
})
export class CampaignSendTestMailButton {

    private sending: boolean = false;
    public disabled: boolean = true;

    constructor(private language: language, private model: model, private modal: modal, private backend: backend, private toast: toast) {
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
        let await = this.modal.await('LBL_SENDING');
        if (!this.sending) {
            this.sending = true;
            this.backend.postRequest(`module/CampaignTasks/${this.model.id}/sendtestmail`).subscribe(
                (results: any) => {
                    this.sending = false;
                    await.emit(true);
                    if(results.status == 'success') {
                        this.toast.sendToast('Mails sent');
                    } else {
                        this.toast.sendToast(results.msg, 'error');
                    }
                },
                error => {
                    await.emit(true);
                    this.sending = false;
                    this.toast.sendToast('ERROR');
                });
        }
    }

    /**
     * only show for campaign tasks of type email
     */
    get hidden() {
        return this.model.data.campaigntask_type !== 'Email';
    }

    /**
     * handle the disabled status
     */
    private handleDisabled() {
        // not if activated already
        if (this.model.getField('activated')) {
            this.disabled = true;
            return;
        }

        // not if editing
        if (this.model.data.acl && !this.model.data.acl.edit) {
            this.disabled = true;
            return;
        }

        // only for email
        if (this.model.data.campaigntask_type !== 'Email') {
            this.disabled = true;
            return;
        }

        // mailbox is set
        if (!this.model.data.mailbox_id) {
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
