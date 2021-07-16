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
 * renders the config dialog for the IMAP/SMTP Transfer
 */
@Component({
    selector: "mailboxes-imap-smtp-traffic-manager",
    templateUrl: "./src/workbench/templates/mailboxesimapsmtptrafficmanager.html",
})
export class MailboxesImapSmtpTrafficManager {

    constructor(
        private backend: backend,
        private language: language,
        private model: model,
        private modal: modal,
        private toast: toast,
        private view: view,
        private injector: Injector
    ) {
        let settings = this.model.getField('settings')
        if (!settings || (settings && settings.length == 0)) {
            this.model.setField('settings', {
                imap_inbox_dir: "",
                imap_pop3_display_name: "",
                imap_pop3_encryption: "",
                imap_pop3_host: "",
                imap_pop3_password: "",
                imap_pop3_port: "",
                imap_pop3_protocol_type: "",
                imap_pop3_username: "",
                imap_sent_dir: "",
                imap_trash_dir: "",
                imap_delete_after_fetch: "",
                smtp_allow_self_signed: "",
                smtp_auth: "",
                smtp_encryption: "",
                smtp_host: "",
                smtp_port: "",
                smtp_verify_peer: "",
                smtp_verify_peer_name: "",
                reply_to: "",
                shared_mailbox_auth_user: "",
                shared_mailbox_user: "",
            });
        }
    }

    /**
     * simple getter to get if the Mailbox allos Inbound and thus renders the IMAP sectio
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
        this.backend.postRequest("module/Mailboxes/imap/folders",{}, {data: modelData})
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
     * opens the modal for the seldection of the IMAP folders
     */
    private displayFoldersModal() {
        let waitingmodal = this.modal.await('loading folders');
        this.getMailboxes().subscribe(
            (response) => {
                waitingmodal.emit(true);
                if (response !== false) {
                    this.modal.openModal("MailboxesIMAPSMTPSelectFoldersModal", true, this.injector).subscribe(
                        (cmp) => {
                            cmp.instance.setMailboxes(response.mailboxes);
                        },
                        (error) => {
                            this.toast.sendToast(error);
                        }
                    );
                }
            }
        );
    }

    /**
     * test the onnection via the backend
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestIMAPModal", true, this.injector);
    }
}
