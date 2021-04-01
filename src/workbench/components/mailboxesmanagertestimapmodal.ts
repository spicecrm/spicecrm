/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

        this.backend.postRequest("mailboxes/test",{}, {
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
