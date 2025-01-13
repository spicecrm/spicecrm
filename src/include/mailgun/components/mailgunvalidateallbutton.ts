import {Component, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'mailgun-validate-all-button',
    templateUrl: '../templates/mailgunvalidateallbutton.html'
})

export class MailgunValidateAllButton {
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

    public execute() {
        this.modal.confirm('VALIDATE_MAILGUN', 'VALIDATE_MAILGUN')
            .subscribe(answer => {
                if (answer) {
                    let awaitModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
                    this.backend.getRequest('channels/mailgun/address/validateAll').subscribe(
                        response => {
                            awaitModal.emit(true);
                            if (response) {
                                this.toast.sendToast('LBL_SUCCESS', 'success');
                            } else {
                                this.toast.sendToast('LBL_ERROR', 'error');
                            }
                        }
                    );
                }
            });
    }


}