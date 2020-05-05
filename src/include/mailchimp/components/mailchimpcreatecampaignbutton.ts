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
    templateUrl: './src/include/mailchimp/templates/mailchimpcreatecampaignbutton.html',
})

export class MailChimpCreateCampaignButton {

    private disabled: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector
    ) {
        this.model.data$.subscribe(data => {
            this.disableButton();
        });
    }

    public disableButton() {
        if (this.model.data.ext_id) {
            this.disabled = true;
            window.console.log(this.disabled);
            return;
        }
    }

    public execute() {
        this.modal.openModal('MailChimpCreateCampaignModal', true, this.injector);
    }

}
