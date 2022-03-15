/**
 * @module CleverReachModule
 */

import {Component} from '@angular/core';
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
    templateUrl: '../templates/getstatsbutton.html',
})
export class GetStatsButton {

    public report: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public backend: backend,
        public toast: toast
    ) {
    }
    /**
     *  until the get request is completed, the modal loads,
     *  when completed it emits either true or false
     */

    public execute() {
        let stopper = this.modal.await('Loading');
        this.backend.getRequest(`channels/emarketing/cleverreach/${this.model.id}/report`)
            .subscribe(response => {
                    this.toast.sendToast(this.language.getLabel('LBL_COMPLETED'));
                    this.report = response;
                    stopper.emit(true);
                },
                (error) => {
                    this.toast.sendAlert(this.language.getLabel('LBL_ERROR'));
                    stopper.emit(true);
                });

    }
}
