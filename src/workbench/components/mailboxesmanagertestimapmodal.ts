/**
 * @module WorkbenchModule
 */
import {Component, ViewChild, ViewContainerRef, EventEmitter} from "@angular/core";
import {backend} from "../../services/backend.service";
import {session} from "../../services/session.service";
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
    private testing: boolean = false;
    private tested: boolean = false;

    constructor(
        private backend: backend,
        private language: language,
        private model: model,
        private session: session,
    ) {
        this.testemailaddress = this.session.authData.email;
    }

    get isInbound() {
        return this.model.getFieldValue('inbound_comm') ? true : false;
    }

    get isOutbound() {
        let outbound = this.model.getFieldValue('outbound_comm');
        return outbound && outbound != 'no' ? true : false;
    }

    public testConnection() {
        this.testing = true;

        let modelData = this.model.utils.spiceModel2backend('Mailboxes', this.model.data);

        this.backend.postRequest("module/Mailboxes/test",{}, {
            data: modelData,
            test_email: this.testemailaddress
        }).subscribe(
            (response: any) => {
                this.validConnection = true;
                if (this.isInbound) {
                    if (response.imap.result !== true) {
                        this.validConnection = false;
                    }

                    if (response.imap.errors && response.imap.errors.length > 0) {
                        this.imapStatus = false;
                    } else {
                        this.imapStatus = true;
                    }
                }

                if (this.isOutbound) {
                    if (response.smtp.errors && response.smtp.errors.length > 0) {
                        this.smtpStatus = false;
                        this.validConnection = false;
                    } else {
                        this.smtpStatus = true;
                    }
                }

                this.tested = true;
                this.testing = false;
            },
            (err: any) => {
                this.testing = false;
            });
    }

    private cancel() {
        this.self.destroy();
    }

    private close() {
        this.isvalid.emit(this.validConnection);
        this.self.destroy();
    }

    get imapIcon() {
        return this.imapStatus ? "check" : "close";
    }

    get smtpIcon() {
        return this.smtpStatus ? "check" : "close";
    }
}
