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
import {Component, Injector, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";


@Component({
    selector: "email-schedules-button",
    templateUrl: "./src/modules/emails/templates/emailschedulesbutton.html",
})
export class EmailSchedulesButton implements OnInit {

    /**
     * the hidden property hiding the button if the user does not have the proper access rights
     */
    public hidden: boolean = true;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector,
        private toast: toast
    ) {
    }

    public ngOnInit(): void {
        this.findEmailsLink();
    }

    /**
     * checks the acl rights for the user to export and that we have some items selected
     */
    get disabled() {
        return  this.modellist.getSelectedCount() == 0;
    }


    /**
     * get the count of the selected objects
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    private findEmailsLink() {
        // check that the user has the right to create email schedules
        if(!this.metadata.checkModuleAcl('EmailSchedules', 'create')) return;

        // check if there is an emails link field on the current module
        let moduleFields = this.metadata.getModuleFields(this.model.module);
        for (let fieldname in moduleFields) {
            let field = moduleFields[fieldname];
            // also check by name to be sure we catch the field
            // ToDo: with vardef manager cleanup and rely on module alone
            if (fieldname == 'emails' || (field.type == 'link' && field.module == 'Emails')) {
                this.hidden = false;
            }
        }
    }

    /**
     * throw error if the field emails doesnt exist
     */
    public execute() {
        if (this.model.fields.hasOwnProperty('emails')) {
            this.modal.openModal('EmailSchedulesModal', true, this.injector);
        } else {
            this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
        }
    }

}
