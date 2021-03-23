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
    templateUrl: './src/modules/systemtenants/templates/systemtenantloaddemodatabutton.html'
})
export class SystemTenantLoadDemoDataButton {

    constructor(private model: model, private modal: modal, private backend: backend) {
    }

    public execute() {
        let spinner = this.modal.await('Loading Demo Data');
        this.backend.postRequest(`module/SystemTenants/${this.model.id}/loaddemodata`).subscribe(success => {
            spinner.emit(true);
        });
    }

}
