/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, Output, SkipSelf} from '@angular/core';

import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";

/**
 * renders a modal to pick a module
 */
@Component({
    selector: 'telephony-call-panel-create-related-modal',
    templateUrl: '../templates/telephonycallcreaterelatedmodal.html',
    providers: [model]
})
export class TelephonyCallCreateRelatedModal {

    /**
     * the reference to the modal
     *
     * @private
     */
    public self: any;

    public modules: string[] = [];


    public selectedModule: string;
    /**
     * emits if the obejct has been selected
     */
    @Output() public moduleselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(public metadata: metadata, public model: model, public modal: modal) {
        this.modules = this.metadata.getPhoneSearchModules();
    }

    /**
     * select the module and create
     */
    public create(){
        this.moduleselected.emit(this.selectedModule);
        this.close();
    }

    /**
     * closes the modal
     */
    public close(){
        this.self.destroy();
    }
}
