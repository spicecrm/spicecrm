/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        this.backend.getRequest('module/CampaignTasks/export/reports').subscribe(reports => {
            this.exportReports = reports;
        });
    }

    private close() {
        this.self.destroy();
    }

    private downloadCSV(reportid) {
        let await = this.modal.await(this.language.getLabel('LBL_DOWNLOADING'));
        this.backend.getDownloadPostRequestFile('module/KReports/plugins/action/kcsvexport/export', {
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
        this.backend.getDownloadPostRequestFile('module/KReports/plugins/action/kexcelexport/export', {
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
