/**
 * @module ModuleReportsMore
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, Injector
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {reporterconfig} from '../../../modules/reports/services/reporterconfig';
import {ReporterDetailPresentationStandard} from "../../../modules/reports/components/reporterdetailpresentationstandard";

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-standardws',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailpresentationstandardws.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailPresentationStandardWS extends ReporterDetailPresentationStandard {

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public injector: Injector,
                public backend: backend,
                public reporterconfig: reporterconfig,
                public cdRef: ChangeDetectorRef,
                public toast: toast) {
        super(language, model, modal, injector, backend, reporterconfig, cdRef, toast);
    }
}
