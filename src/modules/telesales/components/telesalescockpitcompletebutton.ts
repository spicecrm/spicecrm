import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_complete_button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitccompletebutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)': 'complete()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class TeleSalesCockpitCompleteButton {

    constructor(private language: language, private toast: toast, private backend: backend, private metadata: metadata,
                private model: model, private telecockpitservice: telecockpitservice, private footer: footer) {

        this.telecockpitservice.selectedItem$.subscribe(item => {
            this.telecockpitservice.selectedLogId = item.id
        });
    }

    removeCompletedItem(){
        for (let i: number = 0; i < this.telecockpitservice.items.length; i++) {
            if (this.telecockpitservice.items[i]['id'] === this.telecockpitservice.selectedLogId)
                this.telecockpitservice.items.splice(i, 1);
        }
    }

    complete() {
        // execute on backend
        this.backend.postRequest('/module/CampaignLog/' + this.telecockpitservice.selectedLogId + '/completed').subscribe(status => {

            // send toast and set complete
            if (status.success) {
                this.toast.sendToast('Completed', 'success');
                this.model.data.activated = true;

                this.removeCompletedItem();
                this.telecockpitservice.logId = this.telecockpitservice.items[0].id;
            }
            else
                this.toast.sendToast('Error');

        });

    }
}