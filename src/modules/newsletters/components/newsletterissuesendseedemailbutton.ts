import {Component, OnInit} from '@angular/core';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'newsletter-issue-send-seed-email-button',
    templateUrl: '../templates/newsletterissuesendseedemailbutton.html'
})

export class NewsletterIssueSendSeedEmailButton {

    public sending: boolean = false;
    constructor(public modal: modal, public backend: backend, public model: model, public toast: toast, public language: language) {
    }

    get hidden(){
        return !this.model.getField('newsletter_linked')?.placement_seed_prospectlist_id;
    }

    /**
     * handle the disabled status
     */
    get disabled() {

        // not if activated already
        if (this.model.getField('activated')) {
            return true;
            return;
        }

        // not if not allowed to edit
        if (!this.model.checkAccess('edit')) {
            return true;
            return;
        }

        // not if editing
        return this.model.isEditing;
    }

    public execute() {

        let loading = this.modal.await('LBL_SENDING');
        this.sending = true;
        this.backend.postRequest(`module/NewsletterIssues/${this.model.id}/sendseedmail`).subscribe({
            next: res => {
                loading.emit(true);
                loading.complete();
                this.toast.sendToast(`${this.language.getLabel('LBL_SEED_MAILS_SENT')} ${res.sent} from ${res.total}`, 'success');
                this.sending = false;
            }, error: (err) => {
                loading.emit(true);
                loading.complete();
                this.toast.sendToast(err.error.error?.lbl, 'error');
                this.sending = false;
            }
        });
    }
}