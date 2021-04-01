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
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from 'rxjs';
import {metadata} from "../../../services/metadata.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'tele-sales-cockpit-add-attempt-modal',
    templateUrl: './src/modules/telesales/templates/telesalescockpitaddattemptmodal.html',
    providers: [model, view]
})
export class TeleSalesCockpitAddAttemptModal implements OnInit {

    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;
    @Input() private selectedListItem: any;
    @Input() private maxAttempts: any;
    private self: any;
    private fieldset: string = '';

    constructor(
        private language: language,
        private model: model,
        private modelutilities: modelutilities,
        private toast: toast,
        private backend: backend,
        private view: view,
        private metadata: metadata,
    ) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        this.initializeModel();
        this.loadFieldset();
        this.setEditMode();
    }

    private initializeModel() {
        this.model.module = 'CampaignLog';
        this.model.id = this.selectedListItem.id;
        this.model.data = {
            hits: this.selectedListItem.hits,
            planned_activity_date: new moment().add(1, 'days'),
            activity_type: this.selectedListItem.activity_type,
            activity_date: new moment(),
        };
    }

    private loadFieldset() {
        let componentConf = this.metadata.getComponentConfig('TeleSalesCockpitAddAttemptModal');
        this.fieldset = componentConf && componentConf.fieldset ? componentConf.fieldset : '';
    }

    private setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    private cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    private save() {
        let planned_activity_date = this.modelutilities.spice2backend(this.model.module, 'planned_activity_date', this.model.data.planned_activity_date);
        let params = {planned_activity_date: planned_activity_date};

        this.backend.postRequest(`module/CampaignLog/${this.model.id}/attempted`, params)
            .subscribe(
                status => {
                    if (status.success) {
                        this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                        this.responseSubject.next(true);
                        this.responseSubject.complete();
                        this.self.destroy();

                    } else {
                        this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                        this.self.destroy();
                    }
                },
                err => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error'));
    }

    private remove() {
        this.backend.postRequest(`module/CampaignLog/${this.model.id}/completed`)
            .subscribe(
                status => {
                    if (status.success) {
                        this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                        this.responseSubject.next(true);
                        this.self.destroy();
                    } else {
                        this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                    }
                },
                err => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error'));
    }
}
