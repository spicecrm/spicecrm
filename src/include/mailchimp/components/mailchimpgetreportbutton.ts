/**
 * @module MailChimpModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

/**
 * gets the statistics of campaign
 */
@Component({
    selector: 'mailchimp-get-report-button',
    templateUrl: '../templates/mailchimpgetreportbutton.html',
})
export class MailChimpGetReportButton {

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

    public execute() {
        let stopper = this.modal.await('Loading')
        this.backend.getRequest(`channels/emarketing/mailchimp/${this.model.module}/${this.model.id}/report`)
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
