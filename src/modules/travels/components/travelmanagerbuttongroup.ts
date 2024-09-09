import {Component, Injector} from '@angular/core';
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";

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
     * creates a TravelReceipt Bean
     */
    public createTravelReceipt() {
        // temporary solution, until we've got scanner working
        this.modal.openModal("TravelAddManualTravelReceiptModal", true, this.injector).subscribe(componentref => {
            componentref.instance.parent = this.model;
        });

        // prepared for scanner
        /*        this.modal.openModal("TravelAddReceiptModal", true, this.injector).subscribe(componentref => {
            componentref.instance.showToolBars = false;
        });*/
    }

    /**
     * add new TravelMileage
     */
    public createTravelMileage() {
        this.modal.openModal("TravelAddTravelMileageModal", true, this.injector).subscribe(componentref => {
            componentref.instance.parent = this.model;
        });
    }

    /**
     * add new TravelSegment
     */
    public createTravelSegment() {
        this.modal.openModal("TravelAddTravelSegmentModal", true, this.injector).subscribe(componentref => {
            componentref.instance.parent = this.model;
        });
    }

}