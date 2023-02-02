/**
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    templateUrl: '../templates/campaigntaskactivatebutton.html',
    selector: "campaign-activate-button",
})
export class CampaignTaskActivateButton {

    public activating: boolean = false;
    public disabled: boolean = true;

    constructor(public language: language, public metadata: metadata, public model: model, public toast: toast, public backend: backend) {
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }

    /**
     * only show for campaign tasks of type email
     */
    get hidden() {
        return this.model.getField('campaigntask_type') == 'Email';
    }


    public handleDisabled() {

        // not for email
        if (this.model.getFieldValue('campaigntask_type') == 'Email'){
            this.disabled = true;
            return;
        }

        // not if activated
        if (this.model.getFieldValue('activated')){
            this.disabled = true;
            return;
        }

        this.disabled = this.model.isEditing || this.model.getField('activated') === true ? true : false;
    }

    public execute() {
        // if we are activating .. do nothing
        if (this.activating) return;

        // set activating indicator
        this.activating = true;

        // execute on backend
        this.backend.postRequest(`module/CampaignTasks/${this.model.id}/activate`).subscribe(status => {
            this.activating = false;

            // send toast and set actrive
            if (status.success) {
                this.toast.sendToast('Activated');
                this.model.setField('activated', true);

            } else {
                this.toast.sendToast('Error');
            }
        });
    }
}
