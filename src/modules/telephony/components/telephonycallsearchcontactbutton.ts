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
    selector: 'telephony-call-panel-search-contact-button',
    templateUrl: '../templates/telephonycallsearchcontactbutton.html'
})
export class TelephonyCallSearchContactButton {

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

    constructor(public model: model, public modal: modal) {

    }

    /**
     * save the call in the model history
     */
    public execute() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(
            componentref => {
                componentref.instance.module = 'Contacts';
                componentref.instance.selectedItems.subscribe(contacts => {
                    this.updateContact(contacts[0]);
                });
            }
        );
    }

    public updateContact(contact) {
        this.calldata.relatedid = contact.id;
        this.calldata.relatedmodule = 'Contacts';
        this.calldata.relateddata = contact;

        this.modal.openModal('TelephonyCallModelUpdate').subscribe(modalRef => {
            modalRef.instance.calldata = this.calldata;
            modalRef.instance.updated.subscribe(updated => {
                this.actionemitter.emit(true);
            });
        });

    }

}
