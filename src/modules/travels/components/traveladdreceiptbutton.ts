/**
 * @module ModuleTravels
 */
import {Component, Injector, Input} from '@angular/core';
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
                public view: view,
                public model: model,
                private toast: toast,
                private language: language) {

    }

    /**
     * creates a TravelReceipt Bean
     */
    public execute() {
        this.modal.openModal("TravelAddReceiptModal", true, this.injector).subscribe(modalRef => {
            modalRef.instance.showToolBars = false;
            modalRef.instance.saveBean = false;

            // wait for scanner to finish mapping fields
            modalRef.instance.beanData.subscribe({
                next: async (resp: any) => {
                    if(resp) {
                        this.modal.openModal("TravelAddManualTravelReceiptModal", true, this.injector).subscribe(componentref => {

                            // don't set parent module if we are only scanning
                            if(this.model.id == '' || this.model.id == undefined) componentref.instance.parent = undefined;

                            // initialize model in modal before setting model.data object
                            componentref.instance.model.initialize();

                            // populate the model
                            componentref.instance.model.id = resp.id;
                            componentref.instance.model.data = this.model.utils.backendModel2spice('TravelReceipts', resp);
                            componentref.instance.model.setField('receipt_status', this.status)
                        });
                    }
                }, error: (err) => {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error', err.message);
                }
            })
        });
    }

    /**
     *
     */
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

