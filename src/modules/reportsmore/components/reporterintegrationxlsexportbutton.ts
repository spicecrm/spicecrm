/**
 * @module ModuleReportsMore
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {toast} from '../../../services/toast.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

import {reporterconfig} from '../../../modules/reports/services/reporterconfig';

/**
 * @ignore
 */
declare var moment: any;

/**
 * exports the report as XLS
 */
@Component({
    selector: 'reporter-integration-xlsexport-button',
    templateUrl: './src/modules/reportsmore/templates/reporterintegrationxlsexportbutton.html'
})
export class ReporterIntegrationXLSexportButton {

    /**
     * a reference to a download link button as helper for the ajax loader
     */
    @ViewChild('downloadlink', {read: ViewContainerRef, static: true}) private downloadlink: ViewContainerRef;


    private loadUrl: any = undefined;
    private fileName: string = 'file.csv';

    constructor(private language: language, private metadata: metadata, private backend: backend, private model: model, private modal: modal, private footer: footer, private reporterconfig: reporterconfig, private toast: toast) {
    }

    /**
     * a getter to check if the user is allowed to export
     */
    get canExport() {
        return this.model.checkAccess('export');
    }

    /**
     * the export itself
     */
    private exportXLS() {
        // check if user has export right
        if(!this.canExport) return;

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
        this.fileName = this.model.data.name.replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.xlsx';

        let awaitpromise =  this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getDownloadPostRequestFile('KReporter/plugins/action/kexcelexport/export', {
            record: this.model.id,
            dynamicoptions: JSON.stringify(whereConditions)
        }).subscribe(
            url => {
            this.loadUrl = url;
            this.downloadlink.element.nativeElement.href = url;
            this.downloadlink.element.nativeElement.click();
            awaitpromise.emit(true);
        },
            error=> {
                awaitpromise.emit(true);
                this.toast.sendToast('Error Loading File', "error");
            });

    }
}
