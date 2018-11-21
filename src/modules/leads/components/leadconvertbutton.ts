import {Component, Input, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: 'lead-convert-button',
    templateUrl: './src/modules/leads/templates/leadconvertbutton.html'
})
export class LeadConvertButton {

    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private toast: toast, private modal: modal) {
    }

    private execute() {
        if (this.model.data.status === 'Converted') {
            this.toast.sendToast('Lead already Converted', 'warning');
        } else if (this.model.getFieldValue('account_id')) {
            this.modal.openModal('LeadConvertOpportunityModal').subscribe(modalRef => {
                modalRef.instance.lead = this.model;
                modalRef.instance.converted.subscribe((opportunityData: any) => {
                    this.model.setField('status', 'Converted');
                    this.model.setField('opportunity_id', opportunityData.id);
                    this.model.setField('opportunity_name', opportunityData.name);
                    this.model.setField('opportunity_amount', opportunityData.amount);
                    this.model.save();
                });
            });
        } else {
            this.router.navigate(['/module/Leads/' + this.model.id + '/convert']);
        }
    }

    public ngOnInit() {
        this.handleDisabled();
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }

    private handleDisabled() {
        this.disabled = this.model.getFieldValue('status') === 'Converted' || !this.model.checkAccess('edit') ? true : false;
    }
}
