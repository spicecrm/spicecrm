/**
 * @module CleverReachModule
 */

import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

/**
 * gets the statistics of a mailing / campaigntask
 */
@Component({
    templateUrl: '../templates/mailingstatspanel.html',
})
export class MailingStatsPanel implements OnInit {
    public mailingStats: any = {};
    public isLoading: boolean = false;
    public data: any;


    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public backend: backend,
    ) {

    }

    /**
     * reloads mailing activity from backend
     */

    public reloadData() {
        this.isLoading = true;
        this.backend.getRequest(`channels/emarketing/cleverreach/${this.model.id}/stats`)
            .subscribe(response => {
                this.mailingStats = response;
                this.isLoading = false;
            });
    }

    /**
     * loads mailing activity from backend when the application first starts
     */

    public ngOnInit(): void {
        this.backend.getRequest(`channels/emarketing/cleverreach/${this.model.id}/stats`)
        .subscribe(response => {
            this.mailingStats = response;
            this.isLoading = false;
        });

    }

}


