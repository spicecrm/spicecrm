import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { footer } from '../../../services/footer.service';
import { language } from '../../../services/language.service';
import { backend } from '../../../services/backend.service';

import  {reporterconfig} from '../services/reporterconfig';

declare var moment: any;

@Component({
    selector: 'reporter-integration-xlsexport-button',
    templateUrl: './src/modules/reports/templates/reporterintegrationxlsexportbutton.html'
})
export class ReporterIntegrationXLSexportButton {

    @ViewChild('downloadlink', {read: ViewContainerRef}) downloadlink: ViewContainerRef;

    loadUrl: any = undefined;
    fileName: string = 'file.csv';

    constructor( private language: language, private metadata: metadata, private backend: backend,  private model: model, private footer: footer, private reporterconfig: reporterconfig) {
    }

    exportXLS(){
        // build wherecondition
        let whereConditions: Array<any> = [];
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

        this.fileName = this.model.data.name.replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss')+'.xlsx';

        this.backend.getDownloadPostRequestFile('KReporter/plugins/action/kexcelexport/export', {record: this.model.id, dynamicoptions: JSON.stringify(whereConditions)}).subscribe(url => {
            this.loadUrl = url;
            this.downloadlink.element.nativeElement.href = url;
            this.downloadlink.element.nativeElement.click();
        });

    }
}