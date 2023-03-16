/**
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

declare var moment: any;

@Component({
    selector: 'campaign-export-modal',
    templateUrl: '../templates/campaignexportmodal.html'
})
export class CampaignExportModal {

    public self: any;

    public exportReports: any[] = [];

    constructor(public language: language, public model: model, public backend: backend, public modal: modal, public toast: toast) {
        this.backend.getRequest('module/CampaignTasks/export/reports').subscribe({
            next: (reports: any) => {
                this.exportReports = reports;
            }, error: (error) => {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
    }

    public close() {
        this.self.destroy();
    }

    public downloadCSV(reportid) {
        let loading = this.modal.await(this.language.getLabel('LBL_DOWNLOADING'));
        this.backend.getDownloadPostRequestFile('module/KReports/plugins/action/kcsvexport/export', {
            record: reportid,
            parentbeanId: this.model.id,
            parentbeanModule: this.model.module
        }).subscribe({
            next: (url: string) => {
                this.downloadURL(url, 'csv');
                loading.emit(true);
                this.close();
            }, error: (error) => {
                loading.emit(true);
            }
        });
    }

    public downloadXLS(reportid) {
        let loading = this.modal.await(this.language.getLabel('LBL_DOWNLOADING'));
        this.backend.getDownloadPostRequestFile('module/KReports/plugins/action/kexcelexport/export', {
            record: reportid,
            parentbeanId: this.model.id,
            parentbeanModule: this.model.module
        }).subscribe({
            next: (url: string) => {
                this.downloadURL(url, 'xlsx');
                loading.emit(true);
                this.close();
            }, error: (error) => {
                loading.emit(true);
            }
        });
    }

    /**
     * creates a download link in the dom and clicks it and then destyory it again
     * @param url
     * @param extension
     */
    public downloadURL(url, extension) {
        // create a link on the document and click for the download
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', this.model.getField('name').replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.' + extension);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}
