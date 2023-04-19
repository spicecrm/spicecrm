/**
 * @module ModuleReports
 */
import {Component, OnDestroy} from '@angular/core';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';
import {Subscription} from "rxjs";

@Component({
    selector: 'reporter-detail-view-refresh-button',
    templateUrl: '../templates/reporterdetailviewrefreshbutton.html'
})
export class ReporterDetailViewRefreshButton implements OnDestroy {

    private subscription = new Subscription();

    constructor(public language: language, public reporterconfig: reporterconfig) {

    }


    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * trigger reload of the report
     */
    public execute() {
        if (this.reporterconfig.isLoading.visualization || this.reporterconfig.isLoading.presentation){
            this.reporterconfig.cancelRequests();
        } else {
            this.reporterconfig.refresh();
        }
    }
}
