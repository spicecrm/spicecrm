/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'administration-dict-repairreset-cache',
    templateUrl: '../templates/administrationdictrepairresetcache.html'
})

export class AdministrationDictRepairResetCache {
    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal) {
    }

    public executeRepairResetCache() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.deleteRequest('system/cache').subscribe(result => {
            loadingModal.emit(true);
            if(result) {
                this.toast.sendToast(this.language.getLabel('LBL_CACHE_RESET'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
    }
}
