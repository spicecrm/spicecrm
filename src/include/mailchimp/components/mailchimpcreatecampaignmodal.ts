/**
 * @module MailChimpModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {Router} from "@angular/router";
import {backend} from '../../../services/backend.service';
import {toast} from "../../../services/toast.service";
import {FormGroup, FormControl} from '@angular/forms';

@Component({
    selector: 'mailchimp-create-campaign-modal',
    templateUrl: '../templates/mailchimpcreatecampaignmodal.html'
})
export class MailChimpCreateCampaignModal {

    public self: any = {};
    public campaign = new FormGroup({
        name: new FormControl(''),
        subject: new FormControl(''),
        type: new FormControl(''),
        text: new FormControl('')
    });

    constructor(
        public language: language,
        public router: Router,
        public metadata: metadata,
        public backend: backend,
        public model: model,
        public modal: modal,
        public toast: toast
    ) {
    }

    public onSubmit() {
        this.backend.postRequest(`channels/emarketing/mailchimp/${this.model.module}/${this.model.id}`, null, this.campaign.value).subscribe(
            response => {
                this.toast.sendToast(this.language.getLabel('LBL_COMPLETED'));
                this.model.setField('ext_id', response.id);
                this.model.save();
                this.router.navigate([`/module/${this.model.module}/${this.model.id}`]);
                this.close();
            },
            (error) => {
                this.toast.sendAlert(this.language.getLabel('LBL_ERROR'));
                console.error(error);
            }
        );

    }

    public close() {
        this.self.destroy();
    }


}
