/**
 * @module ModuleSystemTenants
 */
import {Component} from '@angular/core';

import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'systemtenant-welcome-modal',
    templateUrl: '../templates/systemtenantwelcomemodal.html'
})
export class SystemTenantWelcomeModal {

    /**
     * reference to the modal
     *
     * @private
     */
    public self: any;

    constructor(public modal: modal, public backend: backend) {
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

}
