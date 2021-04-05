/*
SpiceUI 2021.01.001

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
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

declare var moment: any;

@Component({
    templateUrl: './src/modules/campaigns/templates/campaigntaskexportbutton.html'
})
export class CampaignTaskExportButton {

    /**
     * inidctaes if the export is running
     */
    private exporting: boolean = false;

    /**
     * grabbed by the container if the button shoudl be disabled
     */
    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private toast: toast, private backend: backend, private domsanitizer: DomSanitizer) {
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }


    /**
     * only show for campaign tasks of type email
     */
    get hidden() {
        return this.model.data.campaigntask_type == 'Email';
    }


    /**
     * handles the disbaled check
     */
    private handleDisabled() {

        // not if activated
        if (this.model.getFieldValue('activated')) {
            this.disabled = true;
            return;
        }

        // disabled if editing
        this.disabled = this.model.isEditing ? true : false;
    }

    public execute() {
        // if we are activating .. do nothing
        if (this.exporting) return;

        // set activating indicator
        this.exporting = true;

        this.backend.getDownloadPostRequestFile(`/module/CampaignTasks/${this.model.id}/export`, {}).subscribe(url => {

            // create a link on the document and click for the download
            let downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.setAttribute('download', this.model.getField('name').replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss')+'.csv');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // set exporting to false
            this.exporting = false;
        });
    }
}
