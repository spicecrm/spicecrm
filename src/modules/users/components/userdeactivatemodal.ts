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
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

@Component({
    templateUrl: "./src/modules/users/templates/userdeactivatemodal.html"
})

export class UserDeactivateModal {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     * all objects linked to the assigned user
     */
    private objects: any[] = [];

    /**
     * inidcator that we are loading elements for the user
     */
    private loading = true;

    /**
     * boolean to indicate that teh records shopudl be reassigned
     */
    private reassignRecords: boolean = false;

    /**
     * the total number of records to be reassigned
     */
    private totalrecords: number = 0;

    /**
     * the userid to reassign the records to
     */
    private newuserid: string = '';

    constructor(private model: model, private modal: modal, private language: language, private backend: backend, private toast: toast) {
        this.getUserObjects();
    }

    /**
     * get objects assigned to the current user
     */
    private getUserObjects() {
        this.backend.getRequest(`module/Users/${this.model.id}/deactivate`).subscribe(
            res => {
                for (let moduleid in res) {
                    this.objects.push({
                        sysmoduleid: moduleid,
                        count: parseInt(res[moduleid].totalcount, 10),
                        reassign: parseInt(res[moduleid].totalcount, 10) > 0
                    });

                    // count the total records
                    this.totalrecords += parseInt(res[moduleid].totalcount, 10);
                }

                // set the reassign if we found records
                if (this.totalrecords > 0) this.reassignRecords = true;

                // set the loading flag
                this.loading = false;
            },
            error => {
                this.loading = false;
            });
    }

    /**
     * determine if records can be reassigned .. so if we foudn records.
     */
    get canReassign() {
        return this.totalrecords > 0;
    }

    get canSubmit() {
        if (this.reassignRecords && !this.newuserid) {
            return false;
        }

        return true;
    }

    private deactivate() {
        let modules = [];

        // define an empty body. If newuserid is set create the body
        let body: any = {};
        if (this.newuserid) {
            body.modules = [];
            for (let object of this.objects.filter(o => o.reassign)) {
                modules.push(object.sysmoduleid);
            }
            body.newuserid = this.newuserid;
        }

        // create apsinner for the user indicating the process and submit the request
        let spinner = this.modal.await(this.language.getLabel('LBL_DEACTIVATING'));
        this.backend.postRequest(`module/Users/${this.model.id}/deactivate`, {}, body).subscribe(
            res => {
                this.model.getData();
                spinner.emit(true);
                this.close();
            },
            err => {
                spinner.emit(true);
                this.toast.sendToast('an Error occured deactivating the User', 'error');
            }
        );
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

}
