/**
 * @module WorkbenchModule
 */
import {Component, Input, OnInit, ViewContainerRef} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailboxes-a1-traffic-manager",
    templateUrl: "../templates/mailboxesa1trafficmanager.html",
})
export class MailboxesA1TrafficManager implements OnInit {

    @Input() public valid_connection = false;

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public model: model,
        public modal: modal,
        public toast: toast,
        public view: view,
        public ViewContainerRef: ViewContainerRef
    ) {

    }

    public ngOnInit() {
        if (this.model.getField('settings').length === 0) {
            this.model.setField('settings',  {
                api_key: "",
                imap_pop3_display_name: "",
                imap_pop3_username: "",
                reply_to: "",
            });
        }
    }

    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.ViewContainerRef.injector );
    }
}
