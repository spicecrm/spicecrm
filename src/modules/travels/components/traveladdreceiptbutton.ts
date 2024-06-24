/**
 * @module ModuleTravels
 */
import {Component, Injector} from '@angular/core';
import {modal} from '../../../services/modal.service';

@Component({
    selector: 'travel-add-receipt-button',
    templateUrl: '../templates/traveladdreceiptbutton.html'
})
export class TravelAddReceiptButton {

    constructor(public modal: modal, public injector: Injector) {

    }

    public execute() {
        this.modal.openModal("TravelAddReceiptModal", true, this.injector).subscribe(componentref => {
            componentref.instance.showToolBars = false;
        });
    }
    public execute_bak() {
        this.modal.openModal("SystemUploadImage").subscribe(componentref => {
            componentref.instance.cropheight = 300;
            componentref.instance.cropwidth = 300;
            componentref.instance.croptype = 'square';
            componentref.instance.cropresize = true;
            componentref.instance.imagedata.subscribe(image => {
                if (image !== false) {
                }
            });
        });
    }

}

