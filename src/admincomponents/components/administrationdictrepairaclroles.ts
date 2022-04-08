/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'administration-dict-repair-acl-roles',
    templateUrl: '../templates/administrationdictrepairaclroles.html'
})

export class AdministrationDictRepairACLRoles {
    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal) {
    }

    public executeRepairRoles() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest('admin/repair/aclroles').subscribe(result => {
            loadingModal.emit(true);
            if(result) {
                this.toast.sendToast(this.language.getLabel('LBL_ROLES_REPAIRED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
    }
}
