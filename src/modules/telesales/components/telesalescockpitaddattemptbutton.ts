import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {telecockpitservice} from "../services/telecockpit.service";

declare var moment: any;

@Component({
    selector: 'tele_sales_cockpit_add_attempt_button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitaddattemptbutton.html',
    host: {

        'class': 'slds-button slds-button--neutral',

        '(click)': 'openAddAttempModal()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class TeleSalesCockpitAddAttemptButton {

    parent: any = undefined;
    data: any;
    @Input() actionconfig: any;
    constructor(
        public telecockpitservice: telecockpitservice,
        private language: language,
        private modalservice: modal,
        private metadata: metadata,
        private model: model,

    ) {

    }


    removeItem(){
        for (let i: number = 0; i < this.telecockpitservice.items.length; i++) {
            if (this.telecockpitservice.items[i]['id'] === this.telecockpitservice.selectedLogId)
                this.telecockpitservice.items.splice(i, 1);
        }
    }

    openAddAttempModal() {

        let item = this.telecockpitservice.getSelectedLogData;

          this.modalservice.openModal('TeleSalesCockpitAddAttemptModal').subscribe(attemptcallModalRef => {
              attemptcallModalRef.instance['data'] = item.data;
              attemptcallModalRef.instance['selectedLogId'] = this.telecockpitservice.selectedLogId;
              attemptcallModalRef.instance['maxAttempts'] = this.actionconfig.maxAttempts;
              attemptcallModalRef.instance['response'].subscribe( response => {

                if(response == "removed") {
                    this.removeItem();
                    this.telecockpitservice.logId = this.telecockpitservice.items[0].id;
                }

                if (response == "attempted") {
                    item.campaignlog_hits++;
                    this.removeItem();


                }
            });
        });
    }
}