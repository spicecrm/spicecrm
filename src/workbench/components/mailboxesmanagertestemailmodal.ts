import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {backend} from "../../services/backend.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

@Component({
    templateUrl: "./src/workbench/templates/mailboxesmanagertestemailmodal.html",
})
export class MailboxesManagerTestEmailModal {

    public self: any = {};
    private validConnection: boolean = false;
    private testemailaddress: string = "";

    constructor(
        private backend: backend,
        private language: language,
        private model: model
    ) {
    }

    public testConnection() {
        this.backend.getRequest("mailboxes/test", {mailbox_id: this.model.data.id, test_email: this.testemailaddress}).subscribe(
            (response: any) => {
                if (response.imap.result === true) {
                    this.validConnection = true;
                } else {
                    this.validConnection = false;
                }

                if (response.imap.errors && response.imap.errors.length > 0) {
                    // this.toast.sendToast(response.imap.errors);
                } else if (response.smtp.errors && response.smtp.errors.length > 0) {
                    // this.toast.sendToast(response.smtp.errors);
                }

                this.close();
            },
            (err: any) => {
                // this.toast.sendToast("Connection Error #3864");
                this.close();
            });
    }

    private close() {
        this.self.destroy();
    }
}
