import {Component, Input, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {popup} from '../../../services/popup.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'campaign-send-test-mail-button',
    templateUrl: './app/modules/campaigns/templates/campaignsendtestmailbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)': 'sendMail()',
        '[style.display]': 'getDisplay()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class CampaignSendTestMailButton {

    sending: boolean = false;

    constructor(private language: language, private model: model, private backend: backend, private toast: toast) {
    }

    sendMail() {
        if (!this.sending) {
            this.sending = true;
            this.backend.postRequest('module/CampaignTasks/'+this.model.id+'/sendtestmail').subscribe((results: any) => {
                this.sending = false;
                this.toast.sendToast('Mails sent');
            });
        }
    }

    getDisplay() {
        // not if activated already
        if(this.model.getField('activated')){
            return 'none';
        }

        // not if editing
        if(this.model.data.acl && !this.model.data.acl.edit)
            return 'none';

        // only for email
        if(this.model.getField('campaigntask_type') !== 'Email')
            return 'none';

        // mailrelais is set
        if(!this.model.getField('mailbox_id'))
            return 'none';

        // template is set is set
        if(!this.model.getField('email_template_id'))
            return 'none';

        // not if editing
        return this.model.isEditing ? 'none' : 'inherit';
    }

}