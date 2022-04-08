/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-detail-view-refresh-button',
    templateUrl: '../templates/reporterdetailviewrefreshbutton.html'
})
export class ReporterDetailViewRefreshButton {

    constructor(public language: language, public reporterconfig: reporterconfig) {
    }

    /**
     * trigger reload of the report
     */
    public execute() {
        this.reporterconfig.refresh();
    }
}
