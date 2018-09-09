import {Component, OnInit} from "@angular/core";
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
    selector: "mailboxes-mailgun-traffic-manager",
    templateUrl: "./src/workbench/templates/mailboxesmailguntrafficmanager.html",
})
export class MailboxesMailgunTrafficManager implements OnInit {

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private model: model,
        private modal: modal,
        private toast: toast,
        private view: view,
    ) {
        this.model.module = "Mailboxes";
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        if (this.model.data.settings.length === 0) {
            this.model.data.settings = {
                api_key: "",
                domain: "",
                imap_pop3_display_name: "",
                imap_pop3_username: "",
            };
        }
    }

    public testConnection() {

        this.modal.openModal("SystemLoadingModal", false ).subscribe(modalRef => {

            modalRef.instance.messagelabel = "LBL_TESTING_CONNECTION";

            this.model.save();

            this.backend.getRequest(
                "mailboxes/test",
                {mailbox_id: this.model.data.id},
                ).subscribe((response: any) => {
                    if (response.result === true) {
                    } else if (response.errors && response.errors.length > 0) {
                        this.toast.sendToast(response.errors);
                    } else {
                        this.toast.sendToast("Connection Error #3863");
                    }
                    modalRef.instance.self.destroy();
                },
                (err: any) => {
                    this.toast.sendToast("Connection Error #3864");
                    modalRef.instance.self.destroy();
                });
        });

    }
}
