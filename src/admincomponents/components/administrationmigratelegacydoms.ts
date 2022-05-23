/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'administration-migrate-legacy-doms',
    templateUrl: '../templates/administrationmigratelegacydoms.html'
})

export class AdministrationMigrateLegacyDoms {
    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal) {
    }

    public executeMigrate() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.postRequest('admin/migrate/legacydoms').subscribe(result => {
            loadingModal.emit(true);
            if(result) {
                this.toast.sendToast(this.language.getLabel('LBL_MIGRATED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
    }

}
