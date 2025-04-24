/**
 * @module ModuleNewsletters
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'newsletter-issue-send-mail-button',
    templateUrl: '../templates/newsletterissuesendmailbutton.html'
})
export class NewsletterIssueSendMailButton {

    constructor(public language: language,
                public model: model,
                public backend: backend,
                public toast: toast,
                public modal: modal) {
    }

    /**
     * handle the disabled status
     */
    get disabled() {

        // not if activated already
        if (!this.model.getField('status') || this.model.getField('status') != 'planned') {
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

    /**
     * sends emails to que
     * writes campaign_log entry in the backend
     */
    public execute() {
        this.modal.prompt('confirm', 'MSG_QUEUE_NEWSLETTER', 'MSG_QUEUE_NEWSLETTER').subscribe({
            next: (res) => {
                if(res){
                    let loading = this.modal.await('LBL_SENDING');
                    this.backend.postRequest(`module/NewsletterIssues/${this.model.id}/queue`).subscribe({
                        next: () => {

                            loading.emit(true);
                            loading.complete();
                            this.model.getData();
                            this.model.broadcast.broadcastMessage('relatedmodels.reload', {module: 'NewsletterLogs'});
                            this.toast.sendToast(this.language.getLabel("LBL_QUEUED"));
                        }, error: err => {

                            loading.emit(true);
                            loading.complete();
                            this.toast.sendToast(err.error.error?.lbl, 'error');
                        }
                    });
                }
            }
        })
    }
}