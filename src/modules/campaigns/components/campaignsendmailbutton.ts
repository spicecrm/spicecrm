/**
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'campaign-send-mail-button',
    templateUrl: '../templates/campaignsendmailbutton.html'
})
export class CampaignSendMailButton {

    public sending: boolean = false;
    public disabled: boolean = true;

    constructor(public language: language, public model: model, public backend: backend, public toast: toast) {
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }

    public execute() {
        if (!this.sending) {
            this.sending = true;
            this.backend.postRequest(`module/CampaignTasks/${this.model.id}/queuemail`).subscribe((results: any) => {
                this.sending = false;
                this.toast.sendToast('Mails queued');

                // set the campaigntask to activated
                this.model.setField('activated', true);
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
