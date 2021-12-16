/**
 * @module MailChimpModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/* creates campaign on mailchimp */
@Component({
    selector: 'mailchimp-create-campaign-button',
    templateUrl: '../templates/mailchimpcreatecampaignbutton.html',
})

export class MailChimpCreateCampaignButton {

    public disabled: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector
    ) {
        this.model.data$.subscribe(data => {
            this.disableButton();
        });
    }

    public disableButton() {
        if (this.model.data.ext_id) {
            this.disabled = true;
            return;
        }
    }

    public execute() {
        this.modal.openModal('MailChimpCreateCampaignModal', true, this.injector);
    }

}
