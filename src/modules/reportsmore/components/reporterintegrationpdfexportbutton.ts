/**
 * @module ModuleReportsMore
 */
import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

import {reporterconfig} from '../../../modules/reports/services/reporterconfig';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'reporter-integration-pdfexport-button',
    templateUrl: '../templates/reporterintegrationpdfexportbutton.html'
})
export class ReporterIntegrationPDFexportButton {

   // @ViewChild('downloadlink', {read: ViewContainerRef, static: true}) public downloadlink: ViewContainerRef;

    public loadUrl: any = undefined;
    public fileName: string = undefined;

    constructor(public language: language, public metadata: metadata, public backend: backend, public model: model,  public modal: modal, public footer: footer, public reporterconfig: reporterconfig, public toast: toast) {
    }

    get canExport() {
        return this.model.checkAccess('export');
    }

    public exportPDF() {
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

        this.fileName = this.model.getField('name').replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.pdf';

        let awaitpromise = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getDownloadPostRequestFile('module/KReports/plugins/action/kpdfexport/export', {
            record: this.model.id,
            dynamicoptions: JSON.stringify(whereConditions)
        }).subscribe({
            next: (url: string) => {
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                a.download = this.fileName;
                a.type = 'application/pdf';
                a.click();
                a.remove();
                awaitpromise.emit(true);
            }, error: (error) => {
                awaitpromise.emit(true);
                this.toast.sendToast(this.language.getLabel('MSG_ERROR_LOADING_FILE'), 'error');
            }
        });


    }
}
