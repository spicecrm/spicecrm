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
 * @module ModuleActivities
 */
import {Component, Optional, Injector, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {modalwindow} from "../../../services/modalwindow.service";


/**
 * This component shows the closecreatebutton; It opens the "closecreatemodal"
 */
@Component({
    selector: 'action-activity-close-create-button',
    templateUrl: './src/modules/activities/templates/actionactivityclosecreatebutton.html'
})
export class ActionActivityCloseCreateButton implements OnInit {

    /**
     * the actionconfig passed in from the actionset
     */
    public actionconfig: any;

    /**
     * to sneure the user cannot click twice
     */
    private saving: boolean = false;

    /**
     * is set in ngInit to check if in the subsequent modal per the configuration there is at least one type the user can create
     * otherwise it does not make sense to offer him the create new option as an empty modal woudl be rendered next
     */
    private canCreate: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector,
        @Optional() private modalwindow: modalwindow
    ) {

    }

    public ngOnInit(): void {
        // check what we can create afterwards and check if the user can cerate any item
        let componentconfig = this.metadata.getComponentConfig('ActivityCloseCreateModal', this.model.module);
        let newBeanModulesString = componentconfig.newBeanModules;
        if (newBeanModulesString) {
            let newBeanModulesArray = newBeanModulesString.split(",");

            for (let item of newBeanModulesArray) {
                // check if the user can create
                if (this.metadata.checkModuleAcl(item, 'create')) {
                    this.canCreate = true;
                    break;
                }
            }
        }

    }

    get disabled() {
        return this.model.checkAccess('edit') ? false : true;
    }

    /**
     * Click: Validation check; Opens the ActivityCloseCreateModal
     */
    public execute() {
        if (this.saving) return;

        // check if we shoudl set the closed status
        if (this.actionconfig.statusfield && this.actionconfig.statusvalue) {
            if (this.model.getField(this.actionconfig.statusfield) != this.actionconfig.statusvalue) {

                if (!this.model.isEditing) {
                    this.model.startEdit();
                }
                this.model.setField(this.actionconfig.statusfield, this.actionconfig.statusvalue);
            }
        }

        if (this.model.validate()) {
            this.saving = true;
            this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
                this.model.save().subscribe(saved => {
                    // reset the fact that we did save
                    this.saving = false;

                    // close the saving modal
                    modalRef.instance.self.destroy();

                    // if we are in a modal close the modal
                    if (this.modalwindow) this.modalwindow.self.destroy();

                    this.modal.openModal('ActivityCloseCreateModal', true, this.injector).subscribe(editModalRef => {
                        if (editModalRef) {
                            editModalRef.instance.parent = this.model;
                        }
                    });
                });
            });
        } else {
            if (!this.modalwindow) this.model.edit(false);
        }
    }

    /**
     * returns the action label
     *
     * determines if the action can be closed, saved or only new to be created
     */
    get actionlabel() {
        if (this.model.getField(this.actionconfig.statusfield) != this.actionconfig.statusvalue && this.model.getField(this.actionconfig.statusfield) != this.actionconfig.statusvalue) {
            return 'LBL_CLOSE_AND_NEW';
        }

        // if we are editing offer save and new
        if (this.model.isEditing) {
            return 'LBL_SAVE_AND_NEW';
        }

        return 'LBL_NEW';

    }
}





