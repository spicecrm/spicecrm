/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, Output, Injector} from '@angular/core';

import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";

/**
 * renders a button in the the call panel to search for a new contact
 */
@Component({
    selector: 'telephony-call-panel-search-button',
    templateUrl: './src/modules/telephony/templates/telephonycallsearchbutton.html',
    providers:[model]
})
export class TelephonyCallSearchButton {

    /**
     * the calldata object passed in
     *
     * @private
     */
    @Input() private calldata: any;

    /**
     * emits if the obejct has been selected
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(private model: model, private modal: modal, private injector: Injector) {

    }

    /**
     * save the call in the model history
     */
    private execute() {
        this.modal.openModal('TelephonyCallSearchModal').subscribe(
            componentref => {
                componentref.instance.selected.subscribe(selectedModel => {
                    this.updateRelated(selectedModel);
                });
            }
        );

    }

    private updateRelated(model) {
        this.calldata.relatedid = model.id;
        this.calldata.relatedmodule = model.module

        // set the local model and load it
        this.model.id = model.id;
        this.model.module = model.module;
        this.model.getData(true).subscribe(data => {
            this.calldata.relateddata = model.data;
            if(this.model.checkAccess('edit')) {
                this.modal.openModal('TelephonyCallModelUpdate', true, this.injector).subscribe(modalRef => {
                    modalRef.instance.calldata = this.calldata;
                    modalRef.instance.updated.subscribe(updated => {
                        this.actionemitter.emit(true);
                    });
                });
            }
        })
    }

}
