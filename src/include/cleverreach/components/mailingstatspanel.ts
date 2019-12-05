import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

/**
 * gets the statistics of a mailing / campaigntask
 */
@Component({
    templateUrl: './src/include/cleverreach/templates/mailingstatspanel.html',
})
export class MailingStatsPanel implements OnInit {
    public mailingStats: any = {};
    private isLoading: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private backend: backend,
    ) {

    }

    public ngOnInit(): void {
        this.backend.getRequest(`/CleverReach/CampaignTasks/${this.model.id}/stats`)
            .subscribe(response => {
                this.mailingStats = response.basic;
                this.isLoading = false;
            });
    }

}


