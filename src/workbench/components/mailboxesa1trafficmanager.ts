/**
 * @module WorkbenchModule
 */
import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailboxes-a1-traffic-manager",
    templateUrl: "./src/workbench/templates/mailboxesa1trafficmanager.html",
})
export class MailboxesA1TrafficManager implements OnInit {

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private model: model,
        private modal: modal,
        private toast: toast,
        private view: view,
        private ViewContainerRef: ViewContainerRef
    ) {

    }

    public ngOnInit() {
        if (this.model.data.settings.length === 0) {
            this.model.data.settings = {
                api_key: "",
                imap_pop3_display_name: "",
                imap_pop3_username: "",
                reply_to: "",
            };
        }
    }

    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.ViewContainerRef.injector );
    }
}
