import {Component, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'mailgun-validate-email-button',
    templateUrl: '../templates/mailgunvalidateemailbutton.html'
})

export class MailgunValidateEmailButton  {
    constructor(
        public model: model,
        public backend: backend,
        public modal: modal,
        public language: language,
        public toast: toast
    ) {
    }
    get disabled(): boolean {
        return !this.model.checkAccess('edit');
    }

    public execute(){
        let awaitModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest(`channels/mailgun/address/validate/${this.model.id}`).subscribe(
            response => {
                awaitModal.emit(true);
                if (response) {
                    this.toast.sendToast('LBL_SUCCESS', 'success');
                    this.model.getData();
                } else {
                    this.toast.sendToast('LBL_ERROR', 'error');
                }
            }
        );
    }
}