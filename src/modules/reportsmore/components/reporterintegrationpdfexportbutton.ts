/**
 * @module ModuleReportsMore
 */
import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
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

    @ViewChild('downloadlink', {read: ViewContainerRef, static: true}) public downloadlink: ViewContainerRef;

    public loadUrl: any = undefined;
    public fileName: string = undefined;

    constructor(public language: language, public metadata: metadata, public backend: backend, public model: model, public footer: footer, public reporterconfig: reporterconfig) {
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

        this.metadata.addComponent('ReporterIntegrationExportMask', this.footer.footercontainer).subscribe(loadMask => {
            this.backend.getDownloadPostRequestFile('module/KReports/plugins/action/kpdfexport/export', {
                record: this.model.id,
                dynamicoptions: JSON.stringify(whereConditions)
            }).subscribe(url => {
                loadMask.destroy();
                this.downloadlink.element.nativeElement.href = url;
                this.downloadlink.element.nativeElement.click();
            }, error => {
                loadMask.destroy();
            });
        })


    }
}
