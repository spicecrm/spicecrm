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
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "email-schedules-related-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedmodal.html",
    providers: [model, view],
})
export class EmailSchedulesRelatedModal {
    private self: any = {};
    private activetab: string = 'recipients';
    private linkedBeans: any[] = [];
    private modelId: string;
    private currentModule: string;
    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private backend: backend,
                private toast: toast) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    /**
     * initalize emailschedules and filter the linkedBeans
     */
    public ngOnInit() {
        // set the module
        this.model.module = "EmailSchedules";
        // initialize the model
        this.model.initialize();
        // start editing
        this.model.startEdit(false);

        this.fiilterProspects();

    }

    /**
     * if the count of the linked beans is equal to 0 it will be disabled and unselectable
     */
    private fiilterProspects() {
        this.linkedBeans = this.linkedBeans.map(link => {
            link.disabled = link.count == 0;
            link.selected = false;
            return link;
        });
    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
    }

    /**
     * save the emailschedule model data, the current bean id, the current bean name, the selected links and send the object to the backend
     */
    private saveSchedule() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            const selectedLinks = this.linkedBeans.filter(link => link.selected).map(link => link.module);
            let body = {
                beanId: this.modelId,
                bean: this.currentModule,
                links: selectedLinks,
                id: this.model.id,
                data: this.model.data
            };
            let mailboxCondition = body.data.hasOwnProperty('mailbox_id');
            let emailsubjectCondition = body.data.hasOwnProperty('email_subject');
            let selectedLinksCondition = selectedLinks.length > 0;
            if(mailboxCondition && emailsubjectCondition && selectedLinksCondition) {
                this.backend.postRequest('modules/EmailSchedules/saveScheduleFromRelated', {}, body).subscribe(result => {
                    loadingRef.instance.self.destroy();
                    if (result.status) {
                        this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                        this.close();
                    } else {
                        this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                    }
                });
            } else {
                loadingRef.instance.self.destroy();
                let errorOccured = "Following errors occured: ";
                if(!mailboxCondition) {
                    errorOccured += "Mailbox field is emtpy ";
                }
                if(!emailsubjectCondition) {
                    errorOccured += "Email subject is missing ";
                }
                if(!selectedLinksCondition) {
                    errorOccured += "No recipients selected ";
                }
                this.toast.sendAlert(errorOccured, 'warning');
            }

        });
    }

}


