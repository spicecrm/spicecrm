import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'sendgrid-delete-list-button',
    templateUrl: '../templates/sendgriddeletecontactfromunsubscribelistbutton.html',

})

export class SendgridDeleteContactFromUnsubscribeListButton {
    constructor(
        public model: model,
        public language: language,
        public backend: backend,
        public toast: toast,
        public modal: modal,
        public relatedmodels: relatedmodels
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
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD')
            .subscribe(answer => {
                if (answer) {
                    this.relatedmodels.deleteItem(this.model.id);
                    let awaitModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
                    this.backend.deleteRequest(`channels/emarketing/sendgrid/ProspectListUnsubscribes/${this.relatedmodels.id}/suppressions/delete/${this.model.id}`).subscribe(
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
            });

    }


}


