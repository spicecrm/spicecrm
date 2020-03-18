/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-detail-view-refresh-button',
    templateUrl: './src/modules/reports/templates/reporterdetailviewrefreshbutton.html'
})
export class ReporterDetailViewRefreshButton {

    constructor(public language: language, private reporterconfig: reporterconfig) {
    }

    /**
     * trigger reload of the report
     */
    private execute() {
        this.reporterconfig.refresh();
    }
}
