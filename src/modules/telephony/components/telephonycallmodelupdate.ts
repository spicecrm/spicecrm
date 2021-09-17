/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';

import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

/**
 * renders a modal to update the phone fields on a module
 */
@Component({
    selector: 'telephony-call-model-update',
    templateUrl: './src/modules/telephony/templates/telephonycallmodelupdate.html',
    providers: [model, view]
})
export class TelephonyCallModelUpdate implements OnInit {

    /**
     * reference to the modal itself
     * @private
     */
    private self: any;

    /**
     * the calldata object passed in
     *
     * @private
     */
    @Input() private calldata: any;

    /**
     * an event emitter when we need to handle the update
     *
     * @private
     */
    @Output() private updated: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * an array with the fields for the phone
     *
     * @private
     */
    private phoneFields: any[] = [];

    constructor(
        private modal: modal,
        private model: model,
        private view: view,
        private metadata: metadata
    ) {
        this.view.displayLabels = false;
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // get allfields of type phone
        this.getPhoneFields();

        // initialize the model
        this.initializeModel();
    }

    /**
     * gets all fields from the module and filters out the phone fields as we can edit those
     *
     * @private
     */
    private getPhoneFields() {
        let fields = this.metadata.getModuleFields(this.calldata.relatedmodule);
        for (let field in fields) {
            if (fields[field].type == 'phone') {
                this.phoneFields.push(fields[field]);
            }
        }
    }

    /**
     * load the module fresh from thebackend
     * @private
     */
    private initializeModel() {
        // let await = this.modal.await('LBL_LOADING_DATA');
        this.model.module = this.calldata.relatedmodule;
        this.model.id = this.calldata.relatedid;
        /*
        this.model.getData().subscribe(
            loaded => {
                this.model.startEdit();
                this.loaded = true;
                await.emit(true);
            },
            () => {
                await.emit(true);
                this.close();
            });
         */
    }

    /**
     * returns if the model we are editing is dirty
     */
    get isDirty() {
        return this.model.isDirty();
    }

    private copy2Field(field) {
        this.model.setField(field, this.calldata.msisdn);
    }

    /**
     * close the modal
     *
     * @private
     */
    private close() {
        this.updated.emit(false);

        this.self.destroy();
    }

}
