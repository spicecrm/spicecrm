/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'administration-dict-repair-custom-enum',
    templateUrl: '../templates/administrationdictrepaircustomenum.html'
})

export class AdministrationDictRepairCustomEnum {
    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal) {
    }

    /**
     * repair custom enum
     */
    public repair() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.postRequest('admin/repair/custom/enum').subscribe(result => {
            loadingModal.emit(true);
            if(result) {
                this.toast.sendToast(this.language.getLabel('LBL_CACHE_REPAIRED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
    }
}
