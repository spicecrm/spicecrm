/**
 * @module ModuleTeleSales
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_complete_button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitccompletebutton.html'
})
export class TeleSalesCockpitCompleteButton {

    constructor(private language: language,
                private toast: toast,
                private backend: backend,
                private telecockpitservice: telecockpitservice) {
    }

    public execute() {
        let item = this.telecockpitservice.selectedListItem;
        this.backend.postRequest(`module/CampaignLog/${item.id}/completed`)
            .subscribe(
                status => {
                    if (status.success) {
                        this.toast.sendToast(this.language.getLabel('LBL_COMPLETED'), 'success');
                        this.removeItem(item);
                    } else {
                        this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error');
                    }
                }, err => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error'));
    }

    private removeItem(item) {
        let index = this.telecockpitservice.listItems.indexOf(item);
        if (index < 0) {
            return;
        }
        this.telecockpitservice.listItems.splice(index, 1);
        this.telecockpitservice.listItems = this.telecockpitservice.listItems.slice();
        this.telecockpitservice.selectedListItem$ = this.telecockpitservice.listItems[0];
    }
}
