/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/leads/templates/leadconvert.html',
    providers: [model, view]
})
export class LeadConvert {

    /**
     * the module name .. fixed lead
     */
    private moduleName = 'Leads';

    /**
     * the contact this is converted to
     */
    private contact: model = undefined;

    /**
     * the accpount this is converted to
     */
    private account: model = undefined;

    /**
     * the opportunity this gets converted to
     */
    private opportunity: model = undefined;

    /**
     * the current convert step
     */
    private currentConvertStep: number = 0;

    /**
     * the availabel convert steps
     *
     * currently hardcoded .. might make sense to create a generic conmvert method that allows multi step conversion
     */
    private convertSteps: string[] = ['Account', 'Contact', 'Opportunity'];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private navigationtab: navigationtab,
        private modal: modal,
        private toast: toast,
    ) {

        this.loadLead();
    }


    /**
     * caled when the component initializes loading the lead from teh route data
     */
    private loadLead() {
        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.navigationtab.activeRoute.params.id;
        this.model.getData(true, 'detailview').subscribe(data => {
            this.model.startEdit();
            this.navigationtab.setTabInfo({
                displayname: this.language.getLabel('LBL_CONVERT_LEAD') + ': ' + this.model.data.summary_text,
                displaymodule: 'Leads'
            });
        });
    }

    /**
     * returns the class for the step int he guide
     *
     * @param convertStep
     */
    private getStepClass(convertStep: any) {
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
    private getStepComplete(convertStep: any) {
        let thisIndex = this.convertSteps.indexOf(convertStep);
        if (thisIndex < this.currentConvertStep) {
            return true;
        }
        return false;
    }


    /**
     *determines the width in % for the style of the progress bar
     */
    private getProgressBarWidth() {
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
                } else {
                    this.currentConvertStep++;
                }
                break;
            case 1:
                if (this.contact.isNew && this.contact.validate()) {
                    this.currentConvertStep++;
                } else {
                    this.currentConvertStep++;
                }
                break;
            case 2:
                if (this.opportunity && this.opportunity.isNew && this.opportunity.validate()) {
                    this.convert();
                } else {
                    this.convert();
                }
                break;
        }
    }

    /**
     * moves one step backwards
     */
    private prevStep() {
        if (this.currentConvertStep > 0) {
            this.currentConvertStep--;
        }
    }

    /**
     * determines if the next button is shown
     */
    private showNext() {
        return this.currentConvertStep < this.convertSteps.length - 1;
    }

    /**
     * detemrines if the save button is shown
     */
    private showSave() {
        return this.currentConvertStep == this.convertSteps.length - 1;
    }

    /**
     * converts the lead
     */
    private convert() {

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
                this.toast.sendToast(this.language.getLabel('LBL_LEAD') + ' ' + this.model.data.summary_text + ' ' + this.language.getLabel('LBL_CONVERTED'), 'success', '', 30);

                // close the tab
                this.navigationtab.closeTab();
            });
        });

    }


    /*
     * sets the contact from the component
     */
    private setContact(contact) {
        this.contact = contact;
    }

    /**
     * sets the account from the component
     * @param account
     */
    private setAccount(account) {
        this.account = account;
    }

    /**
     * sets the opportunity from the component
     * @param opportunity
     */
    private setOpportunity(opportunity) {
        this.opportunity = opportunity;
    }
}
