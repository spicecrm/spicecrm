
/**
 * @module ModuleSpicePriceDetermination
 */
import {
    Component, Injector
} from '@angular/core';

import {modal} from '../../../services/modal.service';

/**
 * open the price manager modal
 */
@Component({
    selector: 'spice-price-manager-button',
    templateUrl: '../templates/spicepricemanagerbutton.html',
})
export class SpicePriceManagerButton{

    constructor(public modal: modal, public injector: Injector) {
    }

    /**
     * cancel and destroy the modal if we have one
     */
    public execute() {
        this.modal.openModal('SpicePriceManagerModal', true, this.injector);
    }
}
