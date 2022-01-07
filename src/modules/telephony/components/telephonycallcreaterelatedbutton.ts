/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, Output, SkipSelf} from '@angular/core';

import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";

/**
 * renders a button in the the call panel to search for a new contact
 */
@Component({
    selector: 'telephony-call-panel-create-related-button',
    templateUrl: '../templates/telephonycallcreaterelatedbutton.html',
    providers: [model]
})
export class TelephonyCallCreateRelatedButton {

    /**
     * the calldata object passed in
     *
     * @private
     */
    @Input() public calldata: any;

    /**
     * emits if the object has been selected
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(public model: model, public modal: modal) {

    }

    /**
     * prompt the user to select a module and if yes create the record
     */
    public execute() {
        this.modal.openModal('TelephonyCallCreateRelatedModal').subscribe(modalRef => {
            modalRef.instance.moduleselected.subscribe(
                module => {
                    this.model.module = module;
                    this.model.initialize();
                    this.model.addModel(null, null, {phone_mobile: this.calldata.msisdn}).subscribe(
                        modelData => {
                            this.setRelated(module, modelData);
                        }
                    );
                }
            )
        })
    }


    /**
     * set the related data
     *
     * @param model
     * @private
     */
    public setRelated(module, modelData) {
        this.calldata.relatedid = modelData.id;
        this.calldata.relatedmodule = module;
        this.calldata.relateddata = modelData;

        this.actionemitter.emit(true);
    }

}
