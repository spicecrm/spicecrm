/**
 * @module ModuleTeleSales
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {telecockpitservice} from "../services/telecockpit.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'tele-sales-cockpit-add-meeting-button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitaddmeetingbutton.html',
    providers: [model]
})
export class TeleSalesCockpitAddMeetingButton {

    public parent: any = undefined;

    constructor(public telecockpitservice: telecockpitservice,
                private language: language,
                private toast: toast,
                private model: model) {
        this.model.module = 'Meetings';

    }

    public execute() {
        this.model.id = '';
        let item = this.telecockpitservice.selectedCampaignTask;
        let presets = {name: item.summary_text, campaign_id: item.campaign_id, campaigntask_id: item.id};

        this.model.addModel('', this.parent, presets).subscribe(
            response => {
                if (typeof response == 'object') {
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_ADDED'), 'success');
                }
            });
    }
}
