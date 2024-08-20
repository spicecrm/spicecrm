/**
 * @module
 */
import {Component} from '@angular/core';
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {modal} from "../../services/modal.service";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {configurationService} from "../../services/configuration.service";
import {session} from "../../services/session.service";

@Component({
    selector: "object-template-send-test-email-modal",
    templateUrl: "../templates/objecttemplatesendtestemailmodal.html",
    providers: [view],
})
export class ObjectTemplateSendTestEmailModal {

    /**
     * reference to the modal itself
     *
     * @private
     */
    public self: any = {};

    public parsedHtml: any;
    public email_subject: string;
    public mailbox_id: string;
    public email_body: string;
    public recipients:string;
    /**
     * holds a list of the available mailboxes
     */
    public mailboxes: { value: string, display: string }[] = [];

    constructor(public backend: backend,
                public configuration: configurationService,
                public session: session,
                public modal: modal,
                public language: language,
                public model: model,
                public toast: toast) {
    }

    public ngOnInit() {
        this.loadAvailableMailboxes();

        // get the subject --- todo parse the content
        this.email_subject = this.model.getField('subject');

        // get the receipient
        this.recipients = this.session.authData.email;
    }

    /**
     * destroy modal instance
     */
    public close() {
        this.self.destroy();
    }

    /**
     * load outbound mailboxes
     */
    public loadAvailableMailboxes() {

        const options = this.configuration.getData(`mailboxesoutbound`);

        if (!options) {
            this.backend.getRequest("module/Mailboxes/scope", {scope: 'outbound'}).subscribe(
                (results: any) => {

                    this.mailboxes = results.sort((a, b) => a.display.localeCompare(b.display));

                    // cache the options
                    this.configuration.setData(`mailboxesoutbound`, this.mailboxes);
                });
        } else {
            this.mailboxes = options;
        }
    }

    /**
     * sends a test email to selected email address
     */
    public sendTestEmail() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            let body = {
                email_subject: this.email_subject,
                email_body: this.email_body,
                mailbox_id: this.mailbox_id,
                recipients: this.recipients
            };
            this.backend.postRequest(`module/Emails/sendtest`, {}, body).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.success) {
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
            });
        });
    }
}

