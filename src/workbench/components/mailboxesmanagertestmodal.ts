import {Component, ViewChild, ViewContainerRef,EventEmitter} from "@angular/core";
import {backend} from "../../services/backend.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";

@Component({
    templateUrl: "./src/workbench/templates/mailboxesmanagertestmodal.html",
})
export class MailboxesmanagerTestModal {

    public self: any = {};
    private validConnection: boolean = false;
    public isvalid: EventEmitter<boolean> = new EventEmitter<boolean>();
    private testemailaddress: string = "";
    private testing: boolean = false;
    private tested: boolean = false;

    constructor(
        private backend: backend,
        private language: language,
        private model: model
    ) {
    }

    public testConnection() {
        this.testing = true;
        this.backend.getRequest("mailboxes/test", {mailbox_id: this.model.data.id, test_email: this.testemailaddress}).subscribe(
            (response: any) => {
                if (response.result === true) {
                    this.validConnection = true;
                } else {
                    this.validConnection = false;
                }

                this.tested = true;
                this.testing = false;
            },
            (err: any) => {
                this.tested = false;
                this.testing = false;
                this.validConnection = false;
            });
    }

    private close() {
        this.isvalid.emit(this.validConnection);
        this.self.destroy();
    }
}
