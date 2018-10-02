import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {Subject} from "rxjs";
import {backend} from "../../services/backend.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {modelutilities} from "../../services/modelutilities.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailboxes-sendgrid-traffic-manager",
    templateUrl: "./src/workbench/templates/mailboxessendgridtrafficmanager.html",
})
export class MailboxesSendgridTrafficManager implements OnInit {

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
        this.model.module = "Mailboxes";
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        if (this.model.data.settings.length === 0) {
            this.model.data.settings = {
                api_key: "",
                imap_pop3_display_name: "",
                imap_pop3_username: "",
            };
        }
    }

    public testConnection() {

        this.modal.openModal("MailboxesmanagerTestModal", true, this.ViewContainerRef.injector ).subscribe(modalRef => {
            console.log("test happened");
        });

    }
}
