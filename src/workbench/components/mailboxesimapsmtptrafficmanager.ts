import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {Input} from "@angular/core";
import {SimpleChange} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {backend} from "../../services/backend.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modal} from "../../services/modal.service";
import {model} from "../../services/model.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: "mailboxes-imap-smtp-traffic-manager",
    templateUrl: "./src/workbench/templates/mailboxesimapsmtptrafficmanager.html",
})
export class MailboxesImapSmtpTrafficManager implements OnDestroy, OnInit {
    private mailboxes: any[] = [];
    private validConnection: boolean = false;
    private modelsubscription: any = undefined;

    constructor(
        private backend: backend,
        private footer: footer,
        private language: language,
        public metadata: metadata,
        private model: model,
        private modal: modal,
        private toast: toast,
        private view: view,
    ) {
        this.modelsubscription = this.model.data$.subscribe(
            (data) => {
            // this.handleModelChange(data);
            },
        );
    }

    public ngOnInit() {
        if (this.model.data.settings.length === 0) {
            this.model.data.settings = {
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
                smtp_allow_self_signed: "",
                smtp_auth: "",
                smtp_encryption: "",
                smtp_host: "",
                smtp_port: "",
                smtp_verify_peer: "",
                smtp_verify_peer_name: "",
            };
        }
    }

    public ngOnChanges() {
        /*if (this.connectionValidated.firstChange !== true &&
            this.connectionValidated.currentValue === true) {
            if (this.mailboxes.length === 0) {
                this.getMailboxes().subscribe(
                    (response: any) => {
                        this.displayFoldersModal();
                    },
                );
            } else {
                this.displayFoldersModal();
            }
        }*/

    }

    ngOnDestroy() {
        this.modelsubscription.unsubscribe();
    }

    private handleModelChange(data) {
        this.validConnection = false;
        this.mailboxes = [];
    }

    private getMailboxes(): Observable<any> {
        let responseSubject = new Subject<Array<any>>();

        this.backend.getRequest("mailboxes/imap/getmailboxfolders", {mailbox_id: this.model.data.id})
            .subscribe((response: any) => {
                if (response.result === true) {
                    this.mailboxes = response.mailboxes;
                }
                responseSubject.next(response);
                responseSubject.complete();
            });

        return responseSubject.asObservable();
    }

    private displayFoldersModal() {
        this.getMailboxes().subscribe(
            (response) => {
                this.metadata.addComponent(
                    "MailboxFoldersModalComponent",
                    this.footer.footercontainer,
                ).subscribe(
                    (cmp) => {
                        cmp.instance.setModel(this.model);
                        cmp.instance.setMailboxes(this.mailboxes);
                    },
                    (error) => {
                        this.toast.sendToast(error);
                    },
                );
            },
        );
    }

    public testConnection() {
        this.modal.openModal("SystemLoadingModal", false ).subscribe(modalRef => {

            modalRef.instance.messagelabel = "LBL_TESTING_CONNECTION";

            this.model.save();

            this.backend.getRequest("mailboxes/test", {mailbox_id: this.model.data.id}).subscribe(
                (response: any) => {
                    if (response.imap.result === true) {
                        this.validConnection = true;
                    } else {
                        this.validConnection = false;
                    }

                    if (response.imap.errors && response.imap.errors.length > 0) {
                        this.toast.sendToast(response.imap.errors);
                    } else if (response.smtp.errors && response.smtp.errors.length > 0) {
                        this.toast.sendToast(response.smtp.errors);
                    }

                    modalRef.instance.self.destroy();
                },
                (err: any) => {
                    this.toast.sendToast("Connection Error #3864");
                    modalRef.instance.self.destroy();
                });
        });
    }
}
