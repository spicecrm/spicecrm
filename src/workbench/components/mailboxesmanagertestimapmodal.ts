import {Component, ViewChild, ViewContainerRef,EventEmitter} from "@angular/core";
import {backend} from "../../services/backend.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

@Component({
    templateUrl: "./src/workbench/templates/mailboxesmanagertestimapmodal.html",
})
export class MailboxesmanagerTestIMAPModal {

    public self: any = {};
    private validConnection: boolean = false;
    public isvalid: EventEmitter<boolean> = new EventEmitter<boolean>();
    private testemailaddress: string = "";
    private imapStatus: boolean = false;
    private smtpStatus: boolean = false;
    private tested: boolean = false;

    constructor(
        private backend: backend,
        private language: language,
        private model: model
    ) {
    }

    public testConnection() {
        this.backend.getRequest("mailboxes/test", {mailbox_id: this.model.data.id, test_email: this.testemailaddress}).subscribe(
            (response: any) => {
                if (response.imap.result === true) {
                    this.validConnection = true;
                } else {
                    this.validConnection = false;
                }

                if (response.imap.errors && response.imap.errors.length > 0) {
                    this.imapStatus = false;
                } else {
                    this.imapStatus = true;
                }

                if (response.smtp.errors && response.smtp.errors.length > 0) {
                    this.smtpStatus = false;
                } else {
                    this.smtpStatus = true;
                }

                this.tested = true;
            },
            (err: any) => {

            });
    }

    private close() {
        this.isvalid.emit(this.validConnection);
        this.self.destroy();
    }

    get imapIcon(){
        return this.imapStatus ? "check" : "close";
    }

    get smtpIcon(){
        return this.smtpStatus ? "check" : "close";
    }
}
