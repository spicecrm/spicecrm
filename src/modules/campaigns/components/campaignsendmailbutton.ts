/**
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'campaign-send-mail-button',
    templateUrl: '../templates/campaignsendmailbutton.html'
})
export class CampaignSendMailButton {

    public sending: boolean = false;
    public disabled: boolean = true;

    constructor(public language: language,
                public model: model,
                public backend: backend,
                public toast: toast,
                public modal: modal) {
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }

    /**
     * sends emails to que
     * writes campaign_log entry in the backend
     */
    public execute() {
        let loading = this.modal.await('LBL_SENDING');

        if (!this.sending) {
            this.sending = true;
            this.backend.postRequest(`module/CampaignTasks/${this.model.id}/queuemail`).subscribe({
                next: (results: { success: boolean, id: string }) => {
                    this.sending = false;
                    loading.emit(true);
                    if (results.success) {
                        this.toast.sendToast(this.language.getLabel("LBL_MAILS_QUEUED"));
                    } else {
                        this.toast.sendToast(this.language.getLabel('LBL_NO_TARGETS_SELECTED'), 'error');
                    }
                }, error: () => {
                    loading.emit(true);
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR"), 'error');
                }
            });
        }
    }

    /**
     * only show for campaign tasks of type email
     */
    get hidden() {
        return this.model.getField('campaigntask_type') !== 'Email';
    }

    /**
     * handle the disabled status
     */
    public handleDisabled() {

        // not if activated already
        if (this.model.getField('activated')) {
            this.disabled = true;
            return;
        }

        // not if editing
        if (!this.model.checkAccess('edit')) {
            this.disabled = true;
            return;
        }

        // only for email
        if (this.model.getField('campaigntask_type') !== 'Email') {
            this.disabled = true;
            return;
        }

        // mailrelais is set
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
