/**
 * @module ModuleTeleSales
 */
import {Component, Injector} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'tele_sales_cockpit_complete_button',
    templateUrl: '../templates/telesalescockpitccompletebutton.html'
})
export class TeleSalesCockpitCompleteButton {

    constructor(public language: language,
                public toast: toast,
                public backend: backend,
                public injector: Injector,
                public modalservice: modal,
                public telecockpit: telecockpitservice,
                public telecockpitservice: telecockpitservice) {
    }

    public execute() {
        let item = this.telecockpitservice.selectedListItem;
        if (!item) {
            return;
        }
        this.modalservice.openModal('TeleSalesCockpitCompleteModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.selectedListItem = item;
            modalRef.instance.campaignTask = this.telecockpitservice.selectedcampaigntask;
            modalRef.instance.response.subscribe(response => {
                if(!!response)  this.removeItem(item);
            })
        });
    }

    public removeItem(item) {
        let index = this.telecockpitservice.listItems.indexOf(item);
        if (index < 0) {
            return;
        }
        this.telecockpitservice.listItems.splice(index, 1);
        this.telecockpitservice.listItems = this.telecockpitservice.listItems.slice();
        this.telecockpitservice.selectedListItem$ = this.telecockpitservice.listItems[0];
    }
}
