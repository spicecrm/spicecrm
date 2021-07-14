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
 * @module ModuleEmails
 */
import {Component, Injector, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

/**
 * renders a modal to create a scheduled email
 */
@Component({
    selector: "email-schedules-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesmodal.html",
    providers: [model, view],
})
export class EmailSchedulesModal {

    /**
     * reference to the modal itself
     *
     * @private
     */
    private self: any = {};

    constructor(private language: language,
                private model: model,
                @SkipSelf() private parentModel: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private modellist: modellist,
                private backend: backend,
                private toast: toast) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    /**
     * initialize EmailSchedules
     */
    public ngOnInit() {
        // set the module
        this.model.module = 'EmailSchedules';
        // initialize the model
        this.model.initialize(this.parentModel);
        this.model.data.parent_id = this.parentModel.id;
        this.model.data.parent_type = this.parentModel.module;
        // start editing
        this.model.startEdit(false);
    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
    }

    get canSave() {
        return this.model.getField('mailbox_id') && this.model.getField('email_subject') && this.model.getField('email_body');
    }

    /**
     * save selected ids of modellist, module, model data and send object to backend
     */
    private saveSchedule() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            let selectedIds = this.modellist.getSelectedIDs();
            let body = {
                module: this.modellist.module,
                ids: selectedIds,
                data: this.model.data,
                modulefilter: this.modellist.modulefilter,
                searchterm: this.modellist.searchTerm,
                aggregates: this.modellist.selectedAggregates
            };
            this.backend.postRequest(`module/EmailSchedules/${this.model.id}`, {}, body).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.status) {
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                    this.close();
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
            });
        });
    }
}

