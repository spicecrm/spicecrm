/**
 * @module ModuleNewsletters
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'newsletter-issue-send-mail-button',
    templateUrl: '../templates/newsletterissuesendmailbutton.html'
})
export class NewsletterIssueSendMailButton {

    public sending: boolean = false;
    public disabled: boolean = false;
    /**
     * holds the rxjs subscriptions
     * @private
     */
    private subscriptions = new Subscription();

    constructor(public language: language,
                public model: model,
                public backend: backend,
                public toast: toast,
                public modal: modal) {
        // this.subscriptions.add(
        //     this.model.mode$.subscribe(mode => {
        //         this.handleDisabled();
        //     })
        // );
        //
        // this.subscriptions.add(
        //     this.model.data$.subscribe(data => {
        //         this.handleDisabled();
        //     })
        // );
    }

    /**
     * sends emails to que
     * writes campaign_log entry in the backend
     */
    public execute() {
        let loading = this.modal.await('LBL_SENDING');

        if (!this.sending) {
            this.sending = true;
            this.backend.postRequest(`module/NewsletterIssues/${this.model.id}/queue`).subscribe({
                next: () => {
                    this.sending = false;
                    loading.emit(true);
                    loading.complete();
                    this.model.getData();
                    this.model.broadcast.broadcastMessage('relatedmodels.reload', {module: 'NewsletterLogs'});
                    this.toast.sendToast(this.language.getLabel("LBL_QUEUED"));
                }, error: err => {
                    this.sending = false;
                    loading.emit(true);
                    loading.complete();
                    this.toast.sendToast(err.error.error?.lbl, 'error');
                }
            });
        }
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
        this.disabled = this.model.isEditing;
    }

    /**
     * unsubscribe from rxjs subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}