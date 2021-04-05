/*
SpiceUI 2021.01.001

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
import {Component, Injector} from "@angular/core";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";
import {Observable, Subject} from "rxjs";

/**
 * renders the config component for the mailgun transport handler
 */
@Component({
    selector: "mailboxes-mailgun-ews-manager",
    templateUrl: "./src/workbench/templates/mailboxesewstrafficmanager.html",
})
export class MailboxesEWSTrafficManager {

    constructor(
        private language: language,
        private injector: Injector,
        private model: model,
        private modal: modal,
        private view: view,
        private backend: backend
    ) {
        let settings = this.model.getField('settings');
        if (!settings || (settings && settings.length == 0)) {
            this.model.data.settings = {
                ews_host: "",
                ews_username: "",
                ews_password: "",
                ews_email: "",
                ews_folder: "",
                ews_subscriptionid: "",
                ews_push: false
            };
        }
    }

    /**
     * open the test modal and send a test message
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.injector);
    }

    /**
     * retirves the mailbox folders from the backend via the connection
     */
    private getMailboxes(): Observable<any> {
        let responseSubject = new Subject<any>();
        let modelData = this.model.utils.spiceModel2backend('Mailboxes', this.model.data);
        this.backend.postRequest("mailboxes/ews/getmailboxfolders", {}, {data: modelData})
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
                    this.modal.openModal("MailboxesEWSSelectFoldersModal", true, this.injector).subscribe(
                        (cmp) => {
                            cmp.instance.setMailboxes(response.mailboxes);
                        }
                    );

                }
            },
            error => {
                waitingmodal.emit(true);
            }
        );
    }

    get foldername() {
        return this.model.data.settings.ews_folder ? this.model.data.settings.ews_folder.name : '';
    }
}
