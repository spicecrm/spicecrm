/**
 * @module WorkbenchModule
 */
import {Component, Injector} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {model} from "../../services/model.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

/**
 * renders the config dialog for the Gmail Transfer
 */
@Component({
    selector: "mailboxes-gmail-traffic-manager",
    templateUrl: "./src/workbench/templates/mailboxesgmailtrafficmanager.html",
})
export class MailboxesGmailTrafficManager {

    constructor(
        private backend: backend,
        private language: language,
        private model: model,
        private modal: modal,
        private toast: toast,
        private view: view,
        private injector: Injector
    ) {
        let settings = this.model.getField('settings');
        if (!settings || (settings && settings.length == 0)) {
            this.model.setField('settings', {
                gmail_user_name: '',
                gmail_email_address: '',
                gmail_delete_emails: false
            });
        }
    }

    /**
     * simple getter to get if the Mailbox allos Inbound and thus renders the IMAP section.
     */
    get isInbound() {
        return this.model.getFieldValue('inbound_comm') ? true : false;
    }

    /**
     * simple getter to render if the mailbox handles outbound messages and thus renders the SMTP section
     */
    get isOutbound() {
        return this.model.getFieldValue('outbound_comm') != 'no' ? true : false;
    }

    /**
     * retirves the mailbox folders from the backend via the connection
     */
    private getMailboxes(): Observable<any> {
        let responseSubject = new Subject<any>();
        let modelData = this.model.utils.spiceModel2backend('Mailboxes', this.model.data);
        this.backend.postRequest("module/Mailboxes/gmail/labels",{}, {data: modelData})
            .subscribe((response: any) => {
                if (response.result === true) {
                    responseSubject.next(response);
                } else {
                    responseSubject.next(false);
                }

                responseSubject.complete();
            });

        return responseSubject.asObservable();
    }

    /**
     * test the onnection via the backend
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.injector);
    }
}
