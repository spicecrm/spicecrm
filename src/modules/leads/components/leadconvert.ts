/**
 * @module ModuleLeads
 */
import {Component, AfterContentInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';


@Component({
    selector: 'lead-convert',
    templateUrl: './src/modules/leads/templates/leadconvert.html',
    providers: [model, view]
})
export class LeadConvert {

    private moduleName = 'Leads';

    private contact: model = undefined;
    private account: model = undefined;
    private opportunity: model = undefined;

    private currentConvertStep: number = 0;

    private convertSteps: string[] = ['Account', 'Contact', 'Opportunity'];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private navigationtab: navigationtab,
        private modal: modal,
        private toast: toast,
    ) {

        this.loadLead();
    }


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


    private gotoLead() {
        this.router.navigate(['/module/Leads/' + this.model.id]);
    }

    private getStepClass(convertStep: any) {
        let thisIndex = this.convertSteps.indexOf(convertStep);
        if (thisIndex == this.currentConvertStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.currentConvertStep) {
            return 'slds-is-completed';
        }
    }

    private getStepComplete(convertStep: any) {
        let thisIndex = this.convertSteps.indexOf(convertStep);
        if (thisIndex < this.currentConvertStep) {
            return true;
        }
        return false;
    }

    private getProgressBarWidth() {
        return {
            width: (this.currentConvertStep / (this.convertSteps.length - 1) * 100) + '%'
        };
    }

    private nextStep() {
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

    private prevStep() {
        if (this.currentConvertStep > 0) {
            this.currentConvertStep--;
        }
    }

    private showNext() {
        return this.currentConvertStep < this.convertSteps.length - 1;
    }

    private showSave() {
        return this.currentConvertStep == this.convertSteps.length - 1;
    }

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
     * setter for the models
     */
    private setContact(contact) {
        this.contact = contact;
    }

    private setAccount(account) {
        this.account = account;
    }

    private setOpportunity(opportunity) {
        this.opportunity = opportunity;
    }
}
