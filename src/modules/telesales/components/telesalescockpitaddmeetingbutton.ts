import {ChangeDetectorRef, Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {telecockpitservice} from "../services/telecockpit.service";

declare var moment: any;

@Component({
    selector: 'tele_sales_cockpit_add_meeting_button',
    templateUrl: './app/modules/telesales/templates/telesalescockpitaddmeetingbutton.html',
    host: {

        'class': 'slds-button slds-button--neutral',

        '(click)': 'openAddMeetingModal()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ],
    providers: [model]
})
export class TeleSalesCockpitAddMeetingButton {

    parent: any = undefined;

    constructor(public telecockpitservice: telecockpitservice,
                private language: language,
                private modalservice: modal,
                private toast: toast,
                private metadata: metadata,
                private backend: backend,
                private cdr: ChangeDetectorRef,
                private model: model,) {
        this.model.module = 'Meetings';

    }

    openAddMeetingModal() {
        this.model.id = undefined;

        this.model.addModel(
            '', this.parent,
            {
                name: this.telecockpitservice.currentCampaignTaskName,
                campaign_id: this.telecockpitservice.currentCampaignId,
                campaigntask_id: this.telecockpitservice.campaignTaskId,
            }
        ).subscribe(
            response => {
                if (typeof response == 'object')
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_ADDED'), 'success');
            });
    }
}