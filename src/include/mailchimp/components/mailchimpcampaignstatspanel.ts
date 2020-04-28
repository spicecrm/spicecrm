import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";


/**
 * gets the statistics of a  mailchimp campaign / campaigntask
 */
@Component({
    templateUrl: './src/include/mailchimp/templates/mailchimpcampaignstatspanel.html',
})
export class MailChimpCampaignStatsPanel implements OnInit {
    public res: any = {};
    private isLoading: boolean = false;


    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private backend: backend,
    ) {

    }

    public reloadData() {
        this.isLoading = true;
        this.backend.getRequest(`/MailChimp/CampaignTasks/${this.model.id}/analytics`)
            .subscribe(response => {
                this.res = response;
                this.isLoading = false;
            });
    }

    public ngOnInit(): void {
        this.backend.getRequest(`/MailChimp/CampaignTasks/${this.model.id}/analytics`)
            .subscribe(response => {
                this.res = response;
                window.console.log(this.res);
                this.isLoading = false;
            },error => console.log(error));

    }

}
