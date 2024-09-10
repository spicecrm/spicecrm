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
        private injector: Injector,
        private language: language,
        private toast: toast
    ) {
    }

    /**
     * creates a TravelReceipt Bean
     */
    public async createTravelReceipt() {
        this.modal.openModal("TravelAddReceiptModal", true, this.injector).subscribe(modalRef => {
            modalRef.instance.showToolBars = false;
            modalRef.instance.saveBean = false;

            // wait for scanner to finish mapping fields
            modalRef.instance.beanData.subscribe({
                next: async (resp: any) => {
                    this.modal.openModal("TravelAddManualTravelReceiptModal", true, this.injector).subscribe(componentref => {
                        componentref.instance.parent = this.model;

                        // initialize model in modal before setting model.data object
                        componentref.instance.model.initialize();

                        componentref.instance.model.id = resp.id;
                        componentref.instance.model.data = resp;
                    });
                }, error: (err: { message: string; }) => {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error', err.message);
                }
            })
        });
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