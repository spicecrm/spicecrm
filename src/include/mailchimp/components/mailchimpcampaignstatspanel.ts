/**
 * @module MailChimpModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";


/**
 * gets the statistics of a  mailchimp campaign / campaigntask
 */
@Component({
    templateUrl: '../templates/mailchimpcampaignstatspanel.html',
})
export class MailChimpCampaignStatsPanel implements OnInit {
    public res: any = {};
    public isLoading: boolean = false;


    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public backend: backend,
    ) {

    }

    public reloadData() {
        this.isLoading = true;
        this.backend.getRequest(`channels/emarketing/mailchimp/${this.model.module}/${this.model.id}/analytics`)
            .subscribe(response => {
                this.res = response;
                this.isLoading = false;
            });
    }

    public ngOnInit(): void {
        this.backend.getRequest(`channels/emarketing/mailchimp/${this.model.module}/${this.model.id}/analytics`)
            .subscribe(response => {
                this.res = response;
                this.isLoading = false;
            },error => console.log(error));

    }

}
