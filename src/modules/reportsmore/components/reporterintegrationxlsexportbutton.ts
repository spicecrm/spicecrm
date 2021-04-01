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

    private fileName: string = 'file.xls';

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
        if (!this.canExport) return;

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

        let awaitpromise = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getDownloadPostRequestFile('KReporter/plugins/action/kexcelexport/export', {
            record: this.model.id,
            dynamicoptions: JSON.stringify(whereConditions)
        }).subscribe(
            url => {
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                a.download = this.fileName;
                a.type = 'application/x-xls';
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
