import {Component, ComponentRef, OnInit, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import moment from "moment/moment";
import {userpreferences} from "../../../services/userpreferences.service";
import {modal} from "../../../services/modal.service";
import {Subject} from "rxjs";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'travel-add-manual-travel-receipt-modal',
    templateUrl: '../templates/traveladdmanualtravelreceiptmodal.html',
    providers: [model]
})

/**
 * temporary component
 * creating manually a TravelReceipt Bean
 * related to the selected Travel
 */
export class TravelAddManualTravelReceiptModal implements OnInit {

    /**
     * observable subject
     */
    public receiptResponseSubject: Subject<any> = new Subject<any>();

    /**
     * holds self instance of the modal
     */
    public self: ComponentRef<TravelAddManualTravelReceiptModal>;

    /**
     * the fieldset id defined in config
     * */
    public fieldset: string = '';

    constructor(
        public model: model,
        @SkipSelf() public parent: model,
        private modal: modal,
        private metadata: metadata,
        public view: view,
        private userpreferences: userpreferences,
        private toast: toast,
        private language: language
    ) {
        this.model.module = 'TravelReceipts';
        this.loadConfig();
    }

    ngOnInit() {
        // set the model to editing
        this.model.startEdit(false);
        this.view.isEditable = true;
        this.view.setEditMode();

        this.setFields()

    }

    /**
     * loads the config
     */
    public loadConfig() {
        const componentConfig = this.metadata.getComponentConfig('TravelAddManualTravelReceiptModal', this.model.module);
        this.fieldset = componentConfig?.fieldset;
    }

    /**
     * set pre-defined values for specific fields
     */
    public setFields() {
        this.model.setFields({
            receipt_date: moment(this.model.data.receipt_date),
            employee_id: this.userpreferences.session.authData.user.parent_id,
            employee_name: this.userpreferences.session.authData.user.parent_name,
            parent_id: this.parent.data.id,
            parent_type: 'Travels'
        })
    }

    /**
     * save TravelReceipt
     */
    public save() {
        const isSaving = this.modal.await('LBL_SAVING_DATA');

        this.model.save(true).subscribe({
            next: res => {
                this.receiptResponseSubject.next(this.model.data);
                this.receiptResponseSubject.complete()
                isSaving.next(true);
                isSaving.complete();
                this.close();
            },
            error: (err) => {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error', err.message);

                isSaving.next(false);
                isSaving.complete();
                this.close();
            }
        });
    }

    /**
     * closes and destroys the modal
     */
    public close() {
        this.view.isEditable = false;
        this.view.setViewMode();
        this.self.destroy()
    }
}