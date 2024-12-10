import {Component, OnInit} from '@angular/core';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'newsletter-issue-send-test-email-button',
    templateUrl: '../templates/newsletterissuesendtestemailbutton.html'
})

export class NewsletterIssueSendTestEmailButton {

    public sending: boolean = false;
    constructor(public modal: modal, public backend: backend, public model: model, public toast: toast, public language: language) {
    }

    public execute() {

        let loading = this.modal.await('LBL_SENDING');
        this.sending = true;
        this.backend.postRequest(`module/NewsletterIssues/${this.model.id}/sendtestmail`).subscribe({
            next: res => {
                loading.emit(true);
                loading.complete();
                this.toast.sendToast(`${this.language.getLabel('LBL_TEST_MAILS_SENT')} ${res.sent} from ${res.total}`, 'success');
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