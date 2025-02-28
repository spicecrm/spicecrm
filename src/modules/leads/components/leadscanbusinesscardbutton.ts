/**
 * @module ModuleLeads
 */
import {Component, Injector, Input, Optional} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {LeadScanBusinessCardModal} from "./leadscanbusinesscardmodal";

@Component({
    selector: 'lead-scan-business-card-button',
    templateUrl: '../templates/leadscanbusinesscardbutton.html'
})
export class LeadScanBusinessCardButton {

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
        this.modal.openModal("LeadScanBusinessCardModal", true, this.injector);
    }

}

