import {Component, Input, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import { modal } from '../../../services/modal.service';

@Component({
    selector: 'lead-convert-button',
    templateUrl: './app/modules/leads/templates/leadconvertbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)' : 'this.convertlead()',
        '[style.display]' : "getDisplay()"
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class LeadConvertButton {

    showConvertModal: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private toast: toast, private modal: modal ) {}

    convertlead() {
        if (this.model.data.status === 'Converted') {
            this.toast.sendToast('Lead already Converted', 'warning');
        } else if (this.model.getFieldValue('account_id')){
            this.modal.openModal('LeadConvertOpportunityModal').subscribe(modalRef => {
                modalRef.instance.lead = this.model;
                modalRef.instance.converted.subscribe((opportunityData:any) => {
                    this.model.setField('status', 'Converted');
                    this.model.setField('opportunity_id', opportunityData.id);
                    this.model.setField('opportunity_name', opportunityData.name);
                    this.model.save();
                })
            });
        } else {
            this.router.navigate(['/module/Leads/' + this.model.id + '/convert']);
        }
    }

    closeModal(event) {
        this.showConvertModal = false;
    }

    getDisplay(){
        //return this.model.data.status === 'Converted' ? 'none' : '';
        return this.model.getFieldValue('status') === 'Converted' || !this.model.checkAccess('edit') ? 'none' : '';
    }

}