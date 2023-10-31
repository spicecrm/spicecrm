import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'sendgrid-unsubscribe-delete-list-button',
    templateUrl: '../templates/sendgridunsubscribedeletebutton.html',
})

export class SendgridUnsubscribeDeleteButton {
    constructor(
        public model: model,
        public language: language,
        public backend: backend,
        public toast: toast,
        public modal: modal
    ) {}

    /**
     * the button disabled if the list type does not match
     */
//     get disabled() {
//         return this.model.getFieldValue('list_type') != 'event';
//     }

    /**
     * fires rest call from backend to Sendgrid
     */
    public execute() {
        let awaitModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.deleteRequest(`channels/emarketing/sendgrid/ProspectListUnsubscribes/${this.model.id}`).subscribe(
            response => {
                awaitModal.emit(true);
                if(response) {
                    this.toast.sendToast('LBL_SUCCESS', 'success');
                } else {
                    this.toast.sendToast('LBL_ERROR', 'error');
                }
            }
        );
    }


}


