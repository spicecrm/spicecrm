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
 * @module ObjectComponents
 */


import {
    Component, OnInit
} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {broadcast} from "../../services/broadcast.service";
import {view} from "../../services/view.service";

/**
 * renders in the list header action menu and offers the user the option to reassign a set of records
 */
@Component({
    selector: 'object-list-header-actions-assign-modal',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsassignmodal.html',
    providers: [model, view]
})
export class ObjectListHeaderActionsAssignModal implements OnInit {

    /**
     * reference to the modal self
     * @private
     */
    private self: any = {};

    /**
     * indicator if we are submitting data
     *
     * @private
     */
    private submitting: boolean = false;


    constructor(private view: view, private broadcast: broadcast, private backend: backend, private toast: toast, private modal: modal, private model: model, private modellist: modellist) {
    }

    public ngOnInit() {
        this.model.module = this.modellist.module;
        this.model.initialize();

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }

    /**
     * returns if we can submit
     */
    get canSubmit() {
        return !this.submitting && this.model.getField('assigned_user_id');
    }

    /**
     * execute the reassign
     *
     * @private
     */
    private reassign() {
        this.submitting = true;
        let selectedIds = this.modellist.getSelectedIDs();

        let body = {
            assigned_user_id: this.model.getField('assigned_user_id'),
            ids: selectedIds
        };
        let waiting = this.modal.await('updating');
        this.backend.postRequest(`module/${this.model.module}/massupdate/assign`, {}, body).subscribe(
            res => {
                if (res.success) {
                    for (let record of res.data) {
                        this.broadcast.broadcastMessage('model.save', {
                            id: record.id,
                            module: this.model.module,
                            data: record
                        });
                    }
                    this.close();
                } else {
                    this.toast.sendToast('ERROR reassigning records', 'error');
                    this.submitting = false;
                }
                waiting.emit(true);
            },
            err => {
                this.toast.sendToast('ERROR reassigning records', 'error');
                this.submitting = false;
                waiting.emit(true);
            });

    }
}
