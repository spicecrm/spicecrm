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
import {Component, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';
import {toast} from '../../services/toast.service';

/**
 * renders an action button as part of a modellist to select and delete records
 */
@Component({
    selector: 'object-list-header-actions-delete-button',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsdeletebutton.html',
})
export class ObjectListHeaderActionsDeleteButton {

    /**
     * the actionconfig passed in fromthe actionset
     */
    public actionconfig: any = {};

    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = true;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private backend: backend,
        private broadcast: broadcast,
        private toast: toast
    ) {
        // set to hidden if we do not have delete right
        if(this.metadata.checkModuleAcl(this.model.module, 'delete')) this.hidden = false;
    }



    /**
     * checks the acl rights for the user to delete
     */
    get disabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'delete') || this.modellist.getSelectedCount() < 1 || this.modellist.getSelectedCount() > this.maxAllowed;
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get selectedCount() {
        return this.modellist.getSelectedCount();
    }

    /**
     * returns the ax entries allowed to merge. if no value is set this is hardcoded assumed to be 50
     */
    get maxAllowed() {
        return this.actionconfig.maxAllowed ? parseInt(this.actionconfig.maxAllowed, 10) : 100;
    }

    /**
     * execute the delete action
     */
    public execute() {
        if (!this.disabled) {
            // check that we can delete at least all entries - 1
            let deleteable = this.modellist.getSelectedItems().filter(i => !i.acl?.delete).length;
            if (deleteable > 0) {
                this.modal.info(this.language.getLabel('MSG_NO_EDIT_RIGHTS', null, 'long'), this.language.getLabel('MSG_NO_EDIT_RIGHTS'));
            } else {
                this.modal.confirm(this.language.getLabelFormatted('MSG_DELETE_RECORDS', [this.modellist.getSelectedCount()], "long"), this.language.getLabel('MSG_DELETE_RECORDS')).subscribe(res => {
                    if (res) {
                        let spinner = this.modal.await('... processing ...');
                        let body = {
                            ids: this.modellist.getSelectedIDs(),
                            action: 'DELETE'
                        };
                        this.backend.patchRequest(`module/${this.model.module}`, {}, body).subscribe(res => {
                                for (let id of this.modellist.getSelectedIDs()) {
                                    this.broadcast.broadcastMessage('model.delete', {
                                        id: id,
                                        module: this.model.module
                                    });
                                }
                                spinner.emit(true);
                            },
                            () => {
                                this.toast.sendToast('ERROR deleting records', 'error');
                                spinner.emit(true);
                            }
                        );
                    }
                });
            }
        }
    }

}

