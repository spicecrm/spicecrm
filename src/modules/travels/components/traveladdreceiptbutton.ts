/**
 * @module ModuleTravels
 */
import {Component, Injector, Input, Optional} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'travel-add-receipt-button',
    templateUrl: '../templates/traveladdreceiptbutton.html'
})
export class TravelAddReceiptButton {

    /**
     * sets status of the receipt
     */
    @Input() public status: string = 'created';

    /**
     * hides the label
     */
    @Input() public hideLabel: boolean = false;

    constructor(public modal: modal,
                public injector: Injector,
                @Optional() public view: view,
                public model: model) {

    }

    /**
     * creates a TravelReceipt Bean
     */
    public execute() {
        this.modal.openModal("TravelAddManualTravelReceiptModal", true, this.injector);
    }

}

