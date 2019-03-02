/**
 * @module ModuleTeleSales
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {telecockpitservice} from "../services/telecockpit.service";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'tele_sales_cockpit_add_meeting_button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitaddmeetingbutton.html',
    providers: [model]
})
export class TeleSalesCockpitAddMeetingButton {

    public parent: any = undefined;

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

    public execute() {
        this.model.id = undefined;
        let item = this.telecockpitservice.selectedCampaignTask;
        let presets = {name: item.summary_text, campaign_id: item.campaign_id, campaigntask_id: item.id};

        this.model.addModel('', this.parent, presets).subscribe(
            response => {
                if (typeof response == 'object')
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_ADDED'), 'success');
            });
    }
}