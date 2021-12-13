/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';

import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {session} from "../../../services/session.service";

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
    @Output() public updated: EventEmitter<boolean> = new EventEmitter<boolean>();

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
        this.getPhoneFields();

        // initialize the model if we have any phone fields
        if (this.phoneFields.length > 0) {
            this.model.startEdit();
        } else {
            this.close();
        }
    }

    /**
     * gets all fields from the module and filters out the phone fields as we can edit those
     *
     * @private
     */
    public getPhoneFields() {
        let fields = this.metadata.getModuleFields(this.calldata.relatedmodule);
        for (let field in fields) {
            if (fields[field].type == 'phone' && fields[field].phonesearch) {
                this.phoneFields.push(fields[field]);
            }
        }
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
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.calldata.relateddata);
        this.model.startEdit();
    }

    /**
     * gets a formatted MSISDN
     */
    get msisdnFormatted() {
        if (libphonenumber && libphonenumber.parsePhoneNumberFromString && this.session.authData.address_country && this.calldata.msisdn.length > 5) {
            let msisdn = this.calldata.msisdn;
            return libphonenumber.parsePhoneNumberFromString(msisdn, this.session.authData.address_country).formatInternational();
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
        this.model.save();
        this.updated.emit(true);
        this.self.destroy();
    }

    /**
     * close the modal
     *
     * @private
     */
    public close() {
        this.updated.emit(false);

        this.self.destroy();
    }

}
