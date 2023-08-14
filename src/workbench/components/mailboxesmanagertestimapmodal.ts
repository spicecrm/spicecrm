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
    templateUrl: "../templates/mailboxesmanagertestimapmodal.html",
})
export class MailboxesmanagerTestIMAPModal {

    public self: any = {};
    public validConnection: boolean;
    public isvalid: EventEmitter<boolean> = new EventEmitter<boolean>();
    public testemailaddress: string = "";
    public imapStatus: boolean;
    public smtpStatus: boolean;
    public testing: boolean = false;
    public tested: boolean = false;
    /**
     * holds the error message to display
     */
    public errorMessage: string;

    constructor(
        public backend: backend,
        public language: language,
        public model: model,
        public session: session,
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
        }).subscribe({
            next:(response: any) => {
                this.validConnection = true;
                if (this.isInbound) {
                    if (response.imap.result !== true) {
                        this.validConnection = false;
                    }

                    if (!!response.imap?.errors || !!response.errors) {
                        this.imapStatus = false;
                        this.errorMessage = response.errors ?? response.imap.errors;
                    } else {
                        this.imapStatus = true;
                    }
                }

                if (this.isOutbound) {
                    if (!!response.smtp?.errors  || !!response.errors) {
                        this.smtpStatus = false;
                        this.validConnection = false;
                        this.errorMessage = response.errors ?? response.smtp.errors;
                    } else {
                        this.smtpStatus = true;
                    }
                }

                this.tested = true;
                this.testing = false;
            },
            error:(err: any) => {
                this.testing = false;
                this.validConnection = undefined;
                this.errorMessage = err.error?.error?.message ?? err.error?.message;
            }});
    }

    public close() {
        if ( this.validConnection !== undefined ) this.isvalid.emit(this.validConnection);
        this.self.destroy();
    }

    get imapIcon() {
        return this.imapStatus ? "check" : "error";
    }

    get smtpIcon() {
        return this.smtpStatus ? "check" : "error";
    }

    /**
     * handles when esc is pressed on the modal
     */
    public onModalEscX() {
        this.close();
    }

}
