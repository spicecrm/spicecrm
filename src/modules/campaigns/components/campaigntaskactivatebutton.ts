import {Component, Input, HostBinding} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    templateUrl: './src/modules/campaigns/templates/campaigntaskactivatebutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '[style.display]': 'getDisplay()'
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class CampaignTaskActivateButton {

    activating: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private toast: toast, private backend: backend) {
    }

    getDisplay() {

        // not for email
        if(this.model.getFieldValue('campaigntask_type') == 'Email')
            return 'none';

        // not if activated
        if(this.model.getFieldValue('activated'))
            return 'none';

        return this.model.isEditing || this.model.data.activated === true ? 'none' : '';
    }

    activate() {
        // if we are activating .. do nothing
        if(this.activating) return;

        // set activating indicator
        this.activating = true;

        // execute on backend
        this.backend.postRequest('/module/CampaignTasks/' + this.model.id + '/activate').subscribe(status => {
            this.activating = false;

            // send toast and set actrive
            if (status.success) {
                this.toast.sendToast('Activated');
                this.model.setField('activated', true);

            }
            else
                this.toast.sendToast('Error');
        })
    }

}