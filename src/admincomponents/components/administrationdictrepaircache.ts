/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'administration-dict-repair-cache',
    templateUrl: './src/admincomponents/templates/administrationdictrepaircache.html'
})

export class AdministrationDictRepairCache {
    constructor(private backend: backend, private toast: toast, private language: language, private modal: modal) {
    }

    public executeRepairCache() {
        let await = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest('admin/repair/cache').subscribe(result => {
            await.emit(true);
            if(result) {
                this.toast.sendToast(this.language.getLabel('LBL_CACHE_REPAIRED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
    }
}
