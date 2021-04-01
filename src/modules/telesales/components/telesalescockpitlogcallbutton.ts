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
 * @module ModuleTeleSales
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_log_call_button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitlogcallbutton.html',
    providers: [model]
})
export class TeleSalesCockpitLogCallButton {

    private parent: any = undefined;

    constructor(private language: language,
                private telecockpitservice: telecockpitservice,
                private model: model,
                private backend: backend,
                private toast: toast) {
        this.model.module = 'Calls';
    }

    public execute() {
        this.model.id = '';
        let item = this.telecockpitservice.selectedListItem;
        if (!item) {
            return;
        }
        let presets = {
            name: this.telecockpitservice.selectedCampaignTask.summary_text,
            campaigntask_id: this.telecockpitservice.selectedCampaignTask.id
        };

        this.model.addModel('', this.parent, presets).subscribe(response => {
            if (response) {
                let params = {call_id: response.id};

                this.backend.postRequest(`module/CampaignLog/${item.id}/called`, params)
                    .subscribe(status => {
                        if (status.success) {
                            this.updateItem();
                        }
                    }, err => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error'));
            }
        });
    }

    private updateItem() {
        let item = this.telecockpitservice.selectedListItem;
        item.hits++;
        item.related_id = this.model.id;
        item.planned_activity_date = undefined;
    }
}

