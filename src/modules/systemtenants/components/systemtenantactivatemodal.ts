/**
 * @module ModuleSystemTenants
 */
import {Component} from '@angular/core';

import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'systemtenant-activate-modal',
    templateUrl: './src/modules/systemtenants/templates/systemtenantactivatemodal.html'
})
export class SystemTenantActivateModal {

    /**
     * reference to the modal
     *
     * @private
     */
    private self: any;

    constructor(private model: model, private modal: modal, private backend: backend) {
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

    public initialize() {
        let spinner = this.modal.await('initializing');
        this.backend.postRequest(`module/SystemTenants/${this.model.id}/initialize`).subscribe(success => {
            spinner.emit(true);
            this.close();
        });
    }

}
