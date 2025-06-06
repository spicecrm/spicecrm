/**
 * @module ModuleEmails
 */

import {Component, EventEmitter, Output} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: "email-save-draft-button",
    templateUrl: "../templates/emailsavedraftbutton.html",
    standalone: false
})
export class EmailSaveDraftButton {
    public actionconfig;
    @Output() public actionemitter = new EventEmitter();

    public saving: boolean = false;

    constructor(
        public model: model,
        public metadata: metadata,
        public modal: modal,
        public toast: toast,
        public language: language,
    ) {
    }

    public execute() {
        this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING';

            this.saving = true;
            this.model.setFields({
                type: 'draft',
                status: 'draft',
                to_be_sent: false,
            });

            this.model.save().subscribe({
                next: () => {
                    modalRef.instance.self.destroy();
                    this.actionemitter.emit('emaildraftsaved');
                    this.toast.sendToast(this.language.getLabel('LBL_EMAIL_SAVED'), 'success');
                },
                error: err => {
                    modalRef.instance.self.destroy();
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR_SAVING_EMAIL'), 'error');
                    this.saving = false;
                }
            })
        })
    }
}