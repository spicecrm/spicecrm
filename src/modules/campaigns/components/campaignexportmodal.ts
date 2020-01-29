/**
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

declare var moment: any;

@Component({
    templateUrl: './src/modules/campaigns/templates/campaignexportmodal.html'
})
export class CampaignExportModal {

    private self: any;

    private exportReports: any[] = [];

    constructor(private language: language, private model: model, private backend: backend, private modal: modal) {
        this.backend.getRequest('/module/CampaignTasks/export/reports').subscribe(reports => {
            this.exportReports = reports;
        });
    }

    private close() {
        this.self.destroy();
    }

    private downloadCSV(reportid) {
        let await = this.modal.await(this.language.getLabel('LBL_DOWNLOADING'));
        this.backend.getDownloadPostRequestFile('KReporter/plugins/action/kcsvexport/export', {
            record: reportid,
            parentbeanId: this.model.id,
            parentbeanModule: this.model.module
        }).subscribe(
            url => {
                this.downloadURL(url, 'csv');
                await.emit(true);
                this.close();
            },
            error => {
                await.emit(true);
            });
    }

    private downloadXLS(reportid) {
        let await = this.modal.await(this.language.getLabel('LBL_DOWNLOADING'));
        this.backend.getDownloadPostRequestFile('KReporter/plugins/action/kexcelexport/export', {
            record: reportid,
            parentbeanId: this.model.id,
            parentbeanModule: this.model.module
        }).subscribe(
            url => {
                this.downloadURL(url, 'xlsx');
                await.emit(true);
                this.close();
            },
            error => {
                await.emit(true);
            });
    }

    /**
     * creates a download link in the dom and clicks it and then destyory it again
     * @param url
     * @param extension
     */
    private downloadURL(url, extension) {
        // create a link on the document and click for the download
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', this.model.getField('name').replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.' + extension);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}
