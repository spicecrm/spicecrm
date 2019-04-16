/**
 * @module ModuleTeleSales
 */
import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {telecockpitservice} from "../services/telecockpit.service";

@Component({
    selector: 'tele_sales_cockpit_add_attempt_button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitaddattemptbutton.html'
})

export class TeleSalesCockpitAddAttemptButton {

    @Input() public actionconfig: any;
    public parent: any = undefined;

    constructor(
        public telecockpitservice: telecockpitservice,
        private language: language,
        private modalservice: modal) {
    }

    get maxAttempts() {
        return this.actionconfig && this.actionconfig.maxAttempts ? this.actionconfig.maxAttempts : 5;
    }

    public execute() {
        let item = this.telecockpitservice.selectedListItem;
        if (!item) {
            return;
        }
        this.modalservice.openModal('TeleSalesCockpitAddAttemptModal').subscribe(modalRef => {
            modalRef.instance.selectedListItem = item;
            modalRef.instance.maxAttempts = this.maxAttempts;
            modalRef.instance.response.subscribe(response => this.removeItem(response, item));
        });
    }

    private removeItem(response, item) {
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
