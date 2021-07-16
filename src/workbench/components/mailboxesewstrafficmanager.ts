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
        this.backend.postRequest("module/Mailboxes/ews/folders", {}, {data: modelData})
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
