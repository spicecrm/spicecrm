import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

/**
 * gets the statistics of a mailing / campaigntask
 */
@Component({
    selector: 'get-stats-button',
    templateUrl: './src/include/cleverreach/templates/getstatsbutton.html',
})
export class GetStatsButton {

    public report: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private backend: backend,
        private toast: toast
    ) {
    }

    public execute() {
        let stopper = this.modal.await('Loading')
        this.backend.getRequest(`/CleverReach/CampaignTasks/${this.model.id}/report`)
            .subscribe(response => {
                    this.toast.sendToast(this.language.getLabel('LBL_COMPLETED'));
                    this.report = response;
                    // window.console.log(this.report);
                    stopper.emit(true);
                },
                (error) => {
                    this.toast.sendAlert(this.language.getLabel('LBL_ERROR'));
                    stopper.emit(true);
                });

    }
}
