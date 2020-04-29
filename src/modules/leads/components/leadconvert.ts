/**
 * @module ModuleLeads
 */
import {Component, AfterContentInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {Subject, Observable} from 'rxjs';

@Component({
    selector: 'lead-convert',
    templateUrl: './src/modules/leads/templates/leadconvert.html',
    providers: [model, view],
    styles: [
        ':host >>> global-button-icon svg {fill:#CA1B1F}',
        ':host >>> .slds-progress__marker:hover global-button-icon svg {fill:#FD595D}',
        ':host >>> .slds-progress__marker:active global-button-icon svg {fill:#FD595D}',
        ':host >>> .slds-progress__marker:focus global-button-icon svg {fill:#FD595D}',
    ]
})
export class LeadConvert implements AfterViewInit {


    private moduleName = 'Leads';
    private headerFieldSets: any[] = [];
    private contact: model = undefined;
    private account: model = undefined;
    private selectedaccount: any = undefined;
    private createAccount: boolean = false;
    private opportunity: model = undefined;
    private createOpportunity: boolean = false;

    private createSaveActions: any[] = [];
    private convertSubject: Subject<boolean> = undefined;
    private showSaveModal: boolean = false;

    private currentConvertStep: number = 0;
    private convertSteps: string[] = ['Account', 'Contact', 'Opportunity'];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private navigationtab: navigationtab,
        private toast: toast
    ) {
        let componentconfig = this.metadata.getComponentConfig('ObjectPageHeader', 'Leads');
        this.headerFieldSets = [componentconfig.fieldset];
    }


    public ngAfterViewInit() {

        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.navigationtab.activeRoute.params.id;
        this.model.getData(true, 'detailview').subscribe(data => {
            this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_CONVERT_LEAD')+': '+ this.model.data.summary_text, displaymodule: 'Leads'});
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
                if (this.createAccount && this.account.validate()) {
                    this.currentConvertStep++;
                } else if (!this.createAccount) {
                    this.currentConvertStep++;
                }
                if (this.createAccount) {
                    this.contact.data.account_id = this.account.id;
                    this.contact.data.account_name = this.account.data.name;
                    this.opportunity.data.account_id = this.account.id;
                    this.opportunity.data.account_name = this.account.data.name;
                } else if (this.selectedaccount) {
                    this.contact.data.account_id = this.selectedaccount.id;
                    this.contact.data.account_name = this.selectedaccount.name;
                    this.opportunity.data.account_id = this.selectedaccount.id;
                    this.opportunity.data.account_name = this.selectedaccount.name;
                }
                break;
            case 1:
                if (this.contact.validate()) {
                    this.currentConvertStep++;
                }
                break;
            case 2:
                if (this.createOpportunity && this.opportunity.validate()) {
                    this.convert();
                } else if (!this.createOpportunity) {
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
        this.createSaveActions = [];
        if (this.createAccount) {
            this.createSaveActions.push({
                action: 'createAccount',
                label: 'LBL_LEADCONVERT_CREATEACCOUNT',
                status: 'initial'
            });
        }

        this.createSaveActions.push({
            action: 'createContact',
            label: 'LBL_LEADCONVERT_CREATECONTACT',
            status: 'initial'
        });

        if (this.createOpportunity) {
            this.createSaveActions.push({
                action: 'createOpportunity',
                label: 'LBL_LEADCONVERT_CREATEOPPORTUNITY',
                status: 'initial'
            });
        }

        this.createSaveActions.push({
            action: 'convertLead',
            label: 'LBL_LEADCONVERT_CONVERTLEAD',
            status: 'initial'
        });

        this.showSaveModal = true;

        // process the actions
        this.processConvert().subscribe(() => {
            this.showSaveModal = false;
            // send a toast
            this.toast.sendToast(this.language.getLabel('LBL_LEAD') + ' ' + this.model.data.summary_text + ' ' + this.language.getLabel('LBL_CONVERTED'), 'success', '', 30);
            // go back to the lead
            this.gotoLead();

            // close the tab
            this.navigationtab.closeTab();
        });
    }

    private processConvert(): Observable<boolean> {
        this.convertSubject = new Subject<boolean>();
        this.processConvertActions();
        return this.convertSubject.asObservable();
    }

    private processConvertActions() {
        let nextAction = '';
        this.createSaveActions.some(item => {
            if (item.status === 'initial') {
                nextAction = item.action;
                return true;
            }
        });

        if (nextAction) {
            this.processConvertAction(nextAction);
        } else {
            this.convertSubject.next(true);
            this.convertSubject.complete();
        }
    }

    private processConvertAction(action) {
        switch (action) {
            case 'createAccount':
                this.account.save().subscribe(data => {
                    this.completeConvertAction(action);
                });
                break;
            case 'createContact':
                // complete the contact
                if (this.createAccount) {
                    this.contact.data.account_id = this.account.id;
                } else if (this.selectedaccount) {
                    this.contact.data.account_id = this.selectedaccount.id;
                }

                this.contact.save().subscribe(data => {
                    this.completeConvertAction(action);
                });
                break;
            case 'createOpportunity':
                // complete the opportuinity
                if (this.createAccount) {
                    this.opportunity.data.account_id = this.account.id;
                } else if (this.selectedaccount) {
                    this.opportunity.data.account_id = this.selectedaccount.id;
                }

                this.opportunity.save().subscribe(data => {
                    this.completeConvertAction(action);
                });
                break;
            case 'convertLead':
                // complete the lead
                if (this.createAccount) {
                    this.model.data.account_id = this.account.id;
                } else if (this.selectedaccount) {
                    this.model.data.account_id = this.selectedaccount.id;
                }
                if (this.createOpportunity) {
                    this.model.data.opportunity_id = this.opportunity.id;
                }
                this.model.data.contact_id = this.contact.id;
                this.model.data.status = 'Converted';

                this.model.save().subscribe(data => {
                    this.completeConvertAction(action);
                });
                break;
        }
    }

    private completeConvertAction(action) {
        this.createSaveActions.some(item => {
            if (item.action === action) {
                item.status = 'completed';
                return true;
            }
        });

        // start the next step
        this.processConvertActions();
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

    private setSelectedAccount(accountdata) {
        this.selectedaccount = accountdata;
    }

    private setCreateAccount(value) {
        this.createAccount = value;
    }

    private setOpportunity(opportunity) {
        this.opportunity = opportunity;
    }

    private setCreateOpportunity(value) {
        this.createOpportunity = value;
    }
}
