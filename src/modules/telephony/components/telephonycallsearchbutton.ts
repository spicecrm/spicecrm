/**
 * @module ModuleTelephony
 */
import {Component, ComponentRef, EventEmitter, Injector, Input, Output} from '@angular/core';

import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {TelephonyCallFoundBeansModal} from "./telephonycallfoundbeansmodal";
import {TelephonyCallModelUpdate} from "./telephonycallmodelupdate";
import {metadata} from "../../../services/metadata.service";

declare var _;

/**
 * renders a button in the the call panel to search for a new contact
 */
@Component({
    selector: 'telephony-call-panel-search-button',
    templateUrl: '../templates/telephonycallsearchbutton.html',
    providers: [model]
})
export class TelephonyCallSearchButton {

    /**
     * the calldata object passed in
     *
     * @private
     */
    @Input() public calldata: any;

    /**
     * emits if the obejct has been selected
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(public model: model, public modal: modal, public injector: Injector, private metadata: metadata) {

    }

    /**
     * save the call in the model history
     */
    public execute() {
        this.modal.openModal('TelephonyCallSearchModal').subscribe(
            (modalRef: ComponentRef<TelephonyCallFoundBeansModal>) => {
                modalRef.instance.selected.subscribe({
                    next: selectedModel => this.updateRelated(selectedModel)
                });
            }
        );
    }


    public updateRelated(model) {
        this.calldata.relatedid = model.id;
        this.calldata.relatedmodule = model.module

        // set the local model and load it
        this.model.id = model.id;
        this.model.module = model.module;
        this.model.getData(true).subscribe(data => {
            this.calldata.relateddata = model.data;

            const phoneFields = _.toArray(this.metadata.getModuleFields(this.calldata.relatedmodule))
                .filter(f => f.type == 'phone' && f.phonesearch);

            if (this.model.checkAccess('edit') && phoneFields.length > 0) {
                this.modal.openModal('TelephonyCallModelUpdate', true, this.injector).subscribe((modalRef: ComponentRef<TelephonyCallModelUpdate>) => {
                    modalRef.instance.calldata = this.calldata;
                    modalRef.instance.phoneFields = phoneFields;
                    modalRef.instance.updated.subscribe({
                        next: () => {
                            this.actionemitter.next(true);
                            this.actionemitter.complete();
                        }
                    });
                });
            }
        })
    }

}
