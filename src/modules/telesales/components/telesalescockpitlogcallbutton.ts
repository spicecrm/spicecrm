import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_log_call_button',
    templateUrl: './app/modules/telesales/templates/telesalescockpitlogcallbutton.html',
    host: {
        'class': 'slds-button slds-button--brand',
        '(click)': 'logCall()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ],
    providers: [model]
})
export class TeleSalesCockpitLogCallButton {

    parent: any = undefined;
    selectedLogId: string;

    constructor(private language: language,
                private telecockpitservice: telecockpitservice,
                private metadata: metadata,
                private model: model,
                private footer: footer,
                private backend: backend, private toast: toast) {
        this.model.module = 'Calls';

        this.telecockpitservice.selectedItem$.subscribe(item => {
            this.selectedLogId = item.id;
        });
    }

    logCall() {
        this.model.id = undefined;

        this.model.addModel(
            '', this.parent,
            {
                name: this.telecockpitservice.currentCampaignTaskName,
                campaigntask_id: this.telecockpitservice.campaignTaskId
            }
            ).subscribe(response => {
            if(response) {
                // execute on backend
                let status = 'called';
                let call_id = response.id;

                this.backend.postRequest('/module/CampaignLog/' + this.selectedLogId + '/' + status, {call_id: call_id}).subscribe(status => {

                    if (status.success) {
                        this.toast.sendToast('Call added successfully', 'success');
                        // update service entry
                        let item = this.telecockpitservice.getSelectedLogData;
                        item.hits++;
                        item.related_id = this.model.id;
                        item.related_type = this.model.module;
                        item.planned_activity_date = undefined;
                    }
                    else
                        this.toast.sendToast('Error, try again later');

                });
            }

        });
    }
}