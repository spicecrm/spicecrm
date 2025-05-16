/**
 * @module ModuleSystemTenants
 */
import {Component} from '@angular/core';

import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';

/**
 * a button in an actionset to activate a tenant
 */
@Component({
    templateUrl: '../templates/systemtenantactivatebutton.html'
})
export class SystemTenantActivateButton {

    constructor(public model: model,
                public modal: modal,
                public backend: backend) {
    }

    get disabled() {
        return this.model.data.systemtenant_status == 'provisioned' || this.model.data.systemtenant_status == 'rejected';
    }

    public execute() {
        let spinner = this.modal.await('Initialize Tenant');

        this.backend.postRequest(`module/SystemTenants/${this.model.id}/initialize`).subscribe({
            next: success => {
                spinner.next(true);
                spinner.complete();
                this.modal.toast.sendToast('MSG_SUCCESSFULLY_EXECUTED', 'success');
            },
            error: () => {
                spinner.next(true);
                spinner.complete();
                this.modal.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        });
    }
}
