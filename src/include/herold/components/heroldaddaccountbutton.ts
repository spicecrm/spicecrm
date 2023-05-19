import {Component,Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";


@Component({
    selector: 'herold-add-account-button',
    templateUrl: '../templates/heroldaddaccountbutton.html',
})
export class HeroldAddAccountButton {

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
     * calls the backend route to syncronize targets with Sendinblue, if any are found, passes them to the modal
     */
    public execute() {
        this.modal.openModal('HeroldAddAccountModal', true, this.injector);
    }
}
