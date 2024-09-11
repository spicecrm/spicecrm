/**
 * @module ModuleTeleSales
 */
import {Component, Injector, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {telecockpitservice} from "../services/telecockpit.service";

@Component({
    selector: 'tele_sales_cockpit_add_attempt_button',
    templateUrl: '../templates/telesalescockpitaddattemptbutton.html'
})

export class TeleSalesCockpitAddAttemptButton {

    @Input() public actionconfig: any;
    public parent: any = undefined;

    constructor(
        public telecockpitservice: telecockpitservice,
        public language: language,
        public injector: Injector,
        public modalservice: modal) {
    }

    get maxAttempts() {
        if(this.telecockpitservice && this.telecockpitservice.selectedcampaigntask)
            return this.telecockpitservice.selectedcampaigntask;
        return this.actionconfig && this.actionconfig.maxAttempts ? this.actionconfig.maxAttempts : 5;
    }

    public execute() {
        let item = this.telecockpitservice.selectedListItem;
        if (!item) {
            return;
        }
        this.modalservice.openModal('TeleSalesCockpitAddAttemptModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.selectedListItem = item;
            modalRef.instance.maxAttempts = this.maxAttempts;
            modalRef.instance.campaignTask = this.telecockpitservice.selectedcampaigntask;
            modalRef.instance.response.subscribe(response => this.removeItem(response, item));
        });
    }

    public removeItem(response, item) {
        if (!response) {
            return;
        }
        let index = this.telecockpitservice.listItems.indexOf(item);
        if (index < 0) {
            return;
        }
        this.telecockpitservice.listItems.splice(index, 1);
        this.telecockpitservice.listItems = this.telecockpitservice.listItems.slice();
        this.telecockpitservice.selectedListItem$ = this.telecockpitservice.listItems[0];
    }
}
