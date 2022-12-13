/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';

import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {session} from "../../../services/session.service";
import {Subject} from "rxjs";

declare var libphonenumber: any;

/**
 * renders a modal to update the phone fields on a module
 */
@Component({
    selector: 'telephony-call-model-update',
    templateUrl: '../templates/telephonycallmodelupdate.html',
    providers: [ view]
})
export class TelephonyCallModelUpdate implements OnInit {

    /**
     * reference to the modal itself
     * @private
     */
    public self: any;

    /**
     * the calldata object passed in
     *
     * @private
     */
    @Input() public calldata: any;

    /**
     * an event emitter when we need to handle the update
     *
     * @private
     */
    @Output() public updated: Subject<boolean> = new Subject<boolean>();

    /**
     * an array with the fields for the phone
     *
     * @private
     */
    public phoneFields: any[] = [];

    constructor(
        public modal: modal,
        public model: model,
        public view: view,
        public session: session,
        public metadata: metadata
    ) {
        this.view.displayLabels = false;
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // get allfields of type phone
        this.model.startEdit();
    }

    /**
     * load the module fresh from thebackend
     * @private
     */
    public initializeModel() {
        // let await = this.modal.await('LBL_LOADING_DATA');
        this.model.module = this.calldata.relatedmodule;
        this.model.id = this.calldata.relatedid;
        this.model.initialize();
        this.model.setData(this.calldata.relateddata);
        this.model.startEdit();
    }

    /**
     * gets a formatted MSISDN
     */
    get msisdnFormatted() {
        if (libphonenumber && libphonenumber.parsePhoneNumberFromString && this.session.authData.user.address_country && this.calldata.msisdn.length > 5) {
            let msisdn = this.calldata.msisdn;
            return libphonenumber.parsePhoneNumberFromString(msisdn, this.session.authData.user.address_country).formatInternational();
        } else {
            return this.calldata.msisdn;
        }
    }

    /**
     * returns if the model we are editing is dirty
     */
    get isDirty() {
        return this.model.isDirty();
    }

    public copy2Field(field) {
        this.model.setField(field, this.msisdnFormatted);
    }

    /**
     * update the model
     *
     * @private
     */
    public updateModel() {
        this.model.save(true);
        this.updated.next(true);
        this.updated.complete();
        this.self.destroy();
    }

    /**
     * close the modal
     *
     * @private
     */
    public close() {
        this.updated.next(false);
        this.updated.complete();

        this.self.destroy();
    }

}
