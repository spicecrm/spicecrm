import {Component} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";


@Component({
    selector: "mailbox-set-default-button",
    templateUrl: "../templates/mailboxsetdefaultbutton.html",
})

export class MailboxSetDefaultButton {
    constructor(
        public language: language,
        public backend: backend,
        public toast: toast,
        public model: model
    ) {}

    /**
     * the field is disabled either if no mailbox id is defined or the selected mailbox is already default
     */
    get disabled(): boolean {
        return this.model.data.id == undefined || this.model.getFieldValue('is_default');
    }

    /**
     * set mailbox as default by calling the backend route
     */
    public execute() {
        this.backend.postRequest('module/Mailboxes/default', null, {mailbox_id: this.model.data.id})
            .subscribe(
                (res) => {
                    this.toast.sendToast('success', 'success');
                    this.model.setField('is_default', true);
                },
                (err) => {
                    this.toast.sendToast(err.message, 'error');
                },
            );
    }
}
