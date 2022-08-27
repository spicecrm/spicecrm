/**
 * @module ModuleLeads
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';

/**
 * a convert component that handles the multi stp converting from lead to
 *
 * - Account
 * - Contact
 * - Opportunity
 */
@Component({
    selector: 'lead-convert',
    templateUrl: '../templates/leadconvert.html',
    providers: [model, view]
})
export class LeadConvert {

    /**
     * the module name .. fixed lead
     */
    public moduleName = 'Leads';

    /**
     * the contact this is converted to
     */
    public contact: model = undefined;

    /**
     * the accpount this is converted to
     */
    public account: model = undefined;

    /**
     * the opportunity this gets converted to
     */
    public opportunity: model = undefined;

    /**
     * the current convert step
     */
    public currentConvertStep: number = 0;

    /**
     * the availabel convert steps
     *
     * currently hardcoded .. might make sense to create a generic conmvert method that allows multi step conversion
     */
    public convertSteps: string[] = ['Account', 'Contact', 'Opportunity'];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public navigationtab: navigationtab,
        public modal: modal,
        public toast: toast,
    ) {

        this.loadLead();
    }


    /**
     * caled when the component initializes loading the lead from teh route data
     */
    public loadLead() {
        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.navigationtab.activeRoute.params.id;
        this.model.getData(true, 'detailview').subscribe(data => {
            this.model.startEdit();
            this.navigationtab.setTabInfo({
                displayname: this.language.getLabel('LBL_CONVERT_LEAD') + ': ' + this.model.getField('summary_text'),
                displaymodule: 'Leads'
            });
        });
    }

    /**
     * returns the class for the step int he guide
     *
     * @param convertStep
     */
    public getStepClass(convertStep: any) {
        let thisIndex = this.convertSteps.indexOf(convertStep);
        if (thisIndex == this.currentConvertStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.currentConvertStep) {
            return 'slds-is-completed';
        }
    }

    /**
     * rerutns true if the step is completed for the display
     * @param convertStep
     */
    public getStepComplete(convertStep: any) {
        let thisIndex = this.convertSteps.indexOf(convertStep);
        if (thisIndex < this.currentConvertStep) {
            return true;
        }
        return false;
    }


    /**
     *determines the width in % for the style of the progress bar
     */
    public getProgressBarWidth() {
        return {
            width: (this.currentConvertStep / (this.convertSteps.length - 1) * 100) + '%'
        };
    }

    /**
     * handles the progressing .. checks model validity if the model is new
     */
    public nextStep() {
        switch (this.currentConvertStep) {

            case 0:
                if (this.account && this.account.isNew && this.account.validate()) {
                    this.currentConvertStep++;
                }
                break;
            case 1:
                if (this.contact.isNew && this.contact.validate()) {
                    this.currentConvertStep++;
                }
                break;
            case 2:
                if (this.opportunity && this.opportunity.isNew && this.opportunity.validate()) {
                    this.convert();
                } else if (!this.opportunity) {
                    this.convert();
                }
                break;
        }
    }

    /**
     * moves one step backwards
     */
    public prevStep() {
        if (this.currentConvertStep > 0) {
            this.currentConvertStep--;
        }
    }

    /**
     * determines if the next button is shown
     */
    public showNext() {
        return this.currentConvertStep < this.convertSteps.length - 1;
    }

    /**
     * detemrines if the save button is shown
     */
    public showSave() {
        return this.currentConvertStep == this.convertSteps.length - 1;
    }

    /**
     * converts the lead
     */
    public convert() {

        // build save actions
        let createSaveActions = [];

        if (this.account?.isNew) {
            createSaveActions.push({
                action: 'createAccount',
                label: 'LBL_LEADCONVERT_CREATEACCOUNT',
                status: 'initial',
                model: this.account
            });
        }

        if (this.contact?.isNew) {
            createSaveActions.push({
                action: 'createContact',
                label: 'LBL_LEADCONVERT_CREATECONTACT',
                status: 'initial',
                model: this.contact
            });
        }

        if (this.opportunity?.isNew) {
            createSaveActions.push({
                action: 'createOpportunity',
                label: 'LBL_LEADCONVERT_CREATEOPPORTUNITY',
                status: 'initial',
                model: this.opportunity
            });
        }

        this.model.setField('status', 'Converted');
        createSaveActions.push({
            action: 'convertLead',
            label: 'LBL_LEADCONVERT_CONVERTLEAD',
            status: 'initial',
            model: this.model
        });

        this.modal.openModal('LeadConvertModal', false).subscribe(modalref => {
            modalref.instance.saveactions = createSaveActions;
            modalref.instance.completed.subscribe(completed => {
                this.toast.sendToast(this.language.getLabel('LBL_LEAD') + ' ' + this.model.getField('summary_text') + ' ' + this.language.getLabel('LBL_CONVERTED'), 'success', '', 30);

                // close the tab
                this.navigationtab.closeTab();
            });
        });

    }


    /*
     * sets the contact from the component
     */
    public setContact(contact) {
        this.contact = contact;
    }

    /**
     * sets the account from the component
     * @param account
     */
    public setAccount(account) {
        this.account = account;
    }

    /**
     * sets the opportunity from the component
     * @param opportunity
     */
    public setOpportunity(opportunity) {
        this.opportunity = opportunity;
    }
}
