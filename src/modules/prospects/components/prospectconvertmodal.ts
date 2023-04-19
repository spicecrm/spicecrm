/**
 * @module ModuleProspects
 */
import {Component, ComponentRef, OnInit, Optional} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {telecockpitservice} from "../../telesales/services/telecockpit.service";
import {backend} from "../../../services/backend.service";
import {firstValueFrom} from "rxjs";

/**
 * a convert component that handles the multi stp converting from prospect to
 * - Contact
 * - Lead
 */
@Component({
    selector: 'prospect-convert-modal',
    templateUrl: '../templates/prospectconvertmodal.html',
    providers: [view]
})
export class ProspectConvertModal implements OnInit {

    /**
     * reference to the modal itsefl
     */
    public self: ComponentRef<ProspectConvertModal>

    /**
     * calls the module
     */
    public personModuleName = 'Contacts';

    /**
     * the contact is converted to
     */
    public person: model;

    /**
     * the account is converted to
     */
    public account: model;

    /**
     * the current convert step
     */
    public currentConvertStep: 1 | 2 = 1;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public backend: backend,
        @Optional() private telesalesCockpit: telecockpitservice,
        public toast: toast,
    ) {

    }

    /**
     * returns the class for the step in the guide
     *
     * @param convertStep
     */
    public getStepClass(convertStep: 1 | 2) {

        if (convertStep == this.currentConvertStep) {
            return 'slds-is-active';
        }
        if (convertStep < this.currentConvertStep) {
            return 'slds-is-completed';
        }
    }

    /**
     * returns true if the step is completed for the display
     * @param convertStep
     */
    public getStepComplete(convertStep: 1 | 2) {
        return convertStep < this.currentConvertStep;

    }

    /**
     * handles the progressing checks model validity
     * if the model is new
     */
    public nextStep() {
        if (!this.account || this.account?.validate()) {
            this.currentConvertStep++;
        }
    }

    /**
     * handles the saving checks model validity
     * if the model is new
     */
    public save() {
        if (this.person && this.person.validate()) {
            this.convert();
        }
    }

    /**
     * moves one step backwards
     */
    public prevStep() {
        if (this.currentConvertStep > 1) {
            this.currentConvertStep--;
        }
    }

    /**
     * converts the prospect and links to the new contact or lead
     */
    public async convert() {

        const loadingModal = this.modal.await('LBL_SAVING_DATA');

        if (this.account?.isNew) {
            await firstValueFrom(this.account.save());
        }

        if (this.person?.isNew) {
            await firstValueFrom(this.person.save());
        }

        loadingModal.next(true);
        loadingModal.complete();

        this.model.setFields({
            is_converted: 1,
            parent_id: this.person.id,
            parent_type: this.person.module,
            parent_name: this.person.getField('summary_text')
        });

        this.model.save(true).subscribe(() =>
            this.handleCampaignLogTelesales()
        );

        this.close();
    }

    /**
     * handles and retrieves selected entries from the module CampainLog
     */
    private handleCampaignLogTelesales() {

        if (!this.telesalesCockpit) return;

        const item = this.telesalesCockpit.selectedListItem;
        this.backend.postRequest(`module/CampaignLog/${item.id}/converted`)
            .subscribe({
                next: status => {
                        if (!status.success) return;

                        this.toast.sendToast(this.language.getLabel('LBL_CONVERTED'), 'success');

                        this.telesalesCockpit.listItems = this.telesalesCockpit.listItems.filter(e => e.id != item.id);
                        this.telesalesCockpit.selectedListItem$ = this.telesalesCockpit.listItems[0];
                    },
                error: () => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error')
            });
    }

    /**
     * closes already open dialogs
     */
    public close() {
        this.self.destroy();
    }


    /*
     * sets the contact from the component
     */
    public setContact(contact) {
        this.person = contact;
    }

    /**
     * sets model account
     * @param account
     */
    public setAccount(account: model) {
        this.account = account;
    }
    /**
     * moves to convert step 2 if the check
     */
    ngOnInit() {
        if (this.personModuleName != 'Contacts') {
            this.currentConvertStep = 2;
        }
    }
}
