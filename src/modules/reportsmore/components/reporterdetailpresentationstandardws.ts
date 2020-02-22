/**
 * @module ModuleReportsMore
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {reporterconfig} from '../../../modules/reports/services/reporterconfig';
import {ReporterDetailPresentationStandard} from "../../reports/components/reporterdetailpresentationstandard";

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-standardws',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailpresentationstandardws.html'
})
export class ReporterDetailPresentationStandardWS extends ReporterDetailPresentationStandard {

    constructor(public language: language, public model: model, public backend: backend, public reporterconfig: reporterconfig, public toast: toast) {
        super(language, model, backend, reporterconfig, toast);
    }

    private getRecordTotals() {
        try {
            return this.presData.recordtotal;
        } catch (e) {
            return [];
        }
    }

}
