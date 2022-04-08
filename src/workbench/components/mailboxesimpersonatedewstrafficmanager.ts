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
    templateUrl: "../../workbench/templates/mailboxesimpersonatedewstrafficmanager.html",
})
export class MailboxesImpersonatedEWSTrafficManager {
    constructor(
        public language: language,
        public injector: Injector,
        public model: model,
        public modal: modal,
        public view: view,
        public backend: backend
    ){
        let settings = this.model.getField('settings');
        if (!settings || (settings && settings.length == 0)) {
            this.model.data.settings = {
                user_name: "",
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
    public getMailboxes(): Observable<any> {
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


}
