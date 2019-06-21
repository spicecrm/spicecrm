/**
 * @module ModuleReports
 */
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { footer } from '../../../services/footer.service';
import { language } from '../../../services/language.service';
import { backend } from '../../../services/backend.service';

import  {reporterconfig} from '../services/reporterconfig';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'reporter-integration-csvexport-button',
    templateUrl: './src/modules/reports/templates/reporterintegrationcsvexportbutton.html'
})
export class ReporterIntegrationCSVexportButton {

    @ViewChild('downloadlink', {read: ViewContainerRef, static: false}) private downloadlink: ViewContainerRef;

    private loadUrl: any = undefined;
    private fileName: string = undefined;

    constructor( private language: language, private metadata: metadata, private backend: backend,  private model: model, private footer: footer, private reporterconfig: reporterconfig) {
    }

    private exportCSV(){
        // build wherecondition
        let whereConditions: any[] = [];
        for(let userFilter of this.reporterconfig.userFilters){
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            })
        }

        this.fileName = this.model.data.name.replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss')+'.csv';

        this.backend.getDownloadPostRequestFile('KReporter/plugins/action/kcsvexport/export', {record: this.model.id, dynamicoptions: JSON.stringify(whereConditions)}).subscribe(url => {
            this.downloadlink.element.nativeElement.href = url;
            this.downloadlink.element.nativeElement.click();
        });

    }
}
