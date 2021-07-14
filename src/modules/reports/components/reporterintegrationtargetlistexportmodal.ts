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
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'reporter-integration-targetlistexport-modal',
    templateUrl: './src/modules/reports/templates/reporterintegrationtargetlistexportmodal.html'
})
export class ReporterIntegrationTargetlistexportModal {

    private self: any = {};
    private model: any = {};
    private whereConditions: any = {};

    private targetlistname: string = '';

    constructor(private language: language, private metadata: metadata, private backend: backend, private modal: modal) {
    }

    private closeModal() {
        this.self.destroy();
    }

    private exportTargetList() {

        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            // set the loading popover message
            modalRef.instance.messagelabel = 'LBL_CREATING_TARGETLIST';

            // generate body
            let requestbody = {
                targetlist_action: "new",
                targetlist_name: this.targetlistname,
                record: this.model.id,
                whereConditions: btoa(JSON.stringify(this.whereConditions))
            };

            this.backend.postRequest('module/KReports/plugins/action/ktargetlistexport/export_to_targetlist', {}, requestbody).subscribe(result => {
                modalRef.instance.self.destroy();
                this.closeModal();
            });
        });
    }

}
