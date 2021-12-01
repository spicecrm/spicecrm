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
    selector: 'telephony-call-panel-create-contact-button',
    templateUrl: '../templates/telephonycallcreatecontactbutton.html',
    providers: [model]
})
export class TelephonyCallCreateContactButton {

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
        this.model.module = 'Contacts';
    }

    /**
     * save the call in the model history
     */
    public execute() {
        this.model.initialize();
        this.model.addModel(null, null, {phone_mobile: this.calldata.msisdn}).subscribe(
            contact => {
                this.setContact(contact);
            }
        );
    }

    /**
     * set the contact data to the calldata and emit that we are done
     *
     * @param contacts
     * @private
     */
    public setContact(contact) {
        this.calldata.relatedid = contact.id;
        this.calldata.relatedmodule = 'Contacts';
        this.calldata.relateddata = contact;

        this.actionemitter.emit(true);
    }

}
