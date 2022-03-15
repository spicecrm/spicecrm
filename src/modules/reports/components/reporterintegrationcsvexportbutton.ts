/**
 * @module ModuleReports
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {toast} from '../../../services/toast.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

import {reporterconfig} from '../services/reporterconfig';

/**
 * @ignore
 */
declare var moment: any;

/**
 * renmders a button to export as CSV
 */
@Component({
    selector: 'reporter-integration-csvexport-button',
    templateUrl: '../templates/reporterintegrationcsvexportbutton.html'
})
export class ReporterIntegrationCSVexportButton {

    /**
     * the url for the download
     */
    public loadUrl: any = undefined;

    /**
     * the filename for the download link
     */
    public fileName: string = undefined;

    constructor(public language: language, public metadata: metadata, public backend: backend, public model: model, public modal: modal, public footer: footer, public reporterconfig: reporterconfig, public toast: toast) {
    }

    /**
     * a getter to check if the user cna export
     */
    get canExport() {
        return this.model.checkAccess('export');
    }

    /**
     * the export trigger
     */
    public exportCSV() {
        // build wherecondition
        let whereConditions: any[] = [];
        for (let userFilter of this.reporterconfig.userFilters) {
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            });
        }

        // generate a filename
        this.fileName = this.model.getField('name').replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.csv';

        // render the loading modal and trigger the download
        let awaitpromise = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getDownloadPostRequestFile('module/KReports/plugins/action/kcsvexport/export', {
            record: this.model.id,
            dynamicoptions: JSON.stringify(whereConditions)
        }).subscribe(
            url => {
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                a.download = this.fileName;
                a.type = 'text/css';
                a.click();
                a.remove();

                awaitpromise.emit(true);
            },
            error => {
                awaitpromise.emit(true);
                this.toast.sendToast('Error Loading File', "error");
            });

    }
}
