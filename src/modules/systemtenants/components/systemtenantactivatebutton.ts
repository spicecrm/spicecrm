/**
 * @module ModuleSystemTenants
 */
import {Component, Injector} from '@angular/core';

import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';

/**
 * a button in an actionset to activate a tenant
 */
@Component({
    templateUrl: './src/modules/systemtenants/templates/systemtenantactivatebutton.html'
})
export class SystemTenantActivateButton {

    constructor(private model: model, private modal: modal, private backend: backend, private injector: Injector) {
    }

    public execute() {
        let spinner = this.modal.await('Initialize Tenant');
        this.backend.postRequest(`module/SystemTenants/${this.model.id}/initialize`).subscribe(success => {
            spinner.emit(true);
        });
    }

}
