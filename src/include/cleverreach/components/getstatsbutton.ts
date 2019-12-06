import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

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
        private backend: backend
    ) {
    }

    public execute() {
        this.backend.getRequest(`/CleverReach/CampaignTasks/${this.model.id}/report`)
            .subscribe(response => {
                this.report = response;
                window.console.log(this.report);
            });

    }
}
