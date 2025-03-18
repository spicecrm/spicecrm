/**
 * @module ModuleTeleSales
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_log_call_button',
    templateUrl: '../templates/telesalescockpitlogcallbutton.html',
    providers: [model]
})
export class TeleSalesCockpitLogCallButton {

    public parent: any = undefined;

    constructor(public language: language,
                public telecockpitservice: telecockpitservice,
                public model: model,
                public backend: backend,
                public toast: toast) {
        this.model.module = 'Calls';
    }

    public execute() {
        this.model.id = '';
        let item = this.telecockpitservice.selectedListItem;
        if (!item) {
            return;
        }
        let presets = {
            name: this.telecockpitservice.selectedCampaignTask.summary_text,
            campaigntask_id: this.telecockpitservice.selectedCampaignTask.id
        };

        this.model.addModel('', this.parent, presets).subscribe(response => {
            if (response) {
                let params = {call_id: response.id};

                this.backend.postRequest(`module/CampaignLog/${item.id}/called`, params)
                    .subscribe(status => {
                        if (status.success) {
                            this.updateItem();
                        }
                    }, err => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error'));
            }
        });
    }
    get displayLabel() {
        // see if we have a label configured
        if (this.actionconfig.label) return this.actionconfig.label;

        // else standard labels
        return 'LBL_LOG_CALL';
    }
    public updateItem() {
        let item = this.telecockpitservice.selectedListItem;
        item.hits++;
        item.related_id = this.model.id;
        item.planned_activity_date = undefined;
    }
}

