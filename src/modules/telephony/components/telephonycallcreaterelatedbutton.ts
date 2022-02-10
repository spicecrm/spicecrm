/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, Output, SkipSelf} from '@angular/core';

import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";

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

    /**
     * an array with the fields for the phone
     *
     * @private
     */
    public phoneFields: any[] = [];

    constructor(public model: model, public modal: modal, public metadata: metadata) {

    }

    /**
     * prompt the user to select a module and if yes create the record
     */
    public execute() {
        let modules = this.metadata.getPhoneSearchModules();
        if(modules.length == 1){
            this.processCreate(modules[0]);
        } else {
            this.modal.openModal('TelephonyCallCreateRelatedModal').subscribe(modalRef => {
                modalRef.instance.moduleselected.subscribe(
                    module => {
                        this.processCreate(module);
                    }
                )
            })
        }
    }

    /**
     * process the create modal
     *
     * @param module
     * @private
     */
    private processCreate(module){
        this.model.module = module;
        this.model.initialize();

        let presets: any = {};
        this.getPhoneFields();
        for(let pf of this.phoneFields){
            presets[pf.name] = this.calldata.msisdn;
        }

        this.model.addModel(null, null, presets).subscribe(
            modelData => {
                this.setRelated(module, modelData);
            }
        );
    }

    /**
     * gets all fields from the module and filters out the phone fields as we can edit those
     *
     * @private
     */
    public getPhoneFields() {
        this.phoneFields = [];
        let fields = this.metadata.getModuleFields(this.model.module);
        for (let field in fields) {
            if (fields[field].phonesearch) {
                this.phoneFields.push(fields[field]);
            }
        }
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
