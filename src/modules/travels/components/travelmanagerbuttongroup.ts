import {Component, Injector} from '@angular/core';
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'travel-manager-button-group',
    templateUrl: '../templates/travelmanagerbuttongroup.html',
    providers: [view]
})

export class TravelManagerButtonGroup {

    constructor(
        public view: view,
        private modal: modal,
        public model: model,
        private injector: Injector
    ) {
    }

    /**
     * add new TravelMileage
     */
    public createTravelReceipt() {
        this.modal.openModal("TravelAddManualTravelReceiptModal", true, this.injector);
    }
    /**
     * add new TravelMileage
     */
    public createTravelMileage() {
        this.modal.openModal("TravelAddTravelMileageModal", true, this.injector)
    }

    /**
     * add new TravelSegment
     */
    public createTravelSegment() {
        this.modal.openModal("TravelAddTravelSegmentModal", true, this.injector)
    }

}