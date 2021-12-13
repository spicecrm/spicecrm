import {Component,Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";


@Component({
    selector: 'sendinblue-button',
    templateUrl: '../templates/sendinbluebutton.html',
})
export class SendinBlueButton {

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector,
        private backend: backend,
        private toast: toast,

    ) {}



    /**
     * disables the button if there are no prospects
     */
    get disabled() {
        let entry_count = this.model.getFieldValue('entry_count');
        return entry_count == "0";
    }

    /**
     * calls the backend route to syncronize targets with Sendinblue, if any are found, passes them to the modal
     */
    public execute() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));

            this.backend.getRequest(`channels/emarketing/sendinblue/${this.model.module}/${this.model.id}`).subscribe(result => {
                loadingModal.emit(true);
                if (result) {
                    this.modal.openModal('SendinBlueModal', true, this.injector).subscribe(
                        modal => {
                            modal.instance.contacts = result.synced;
                        }
                    );
                } else {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
            });


    }
}
