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
 * @module ObjectComponents
 */
import {Component, EventEmitter, OnInit, Optional, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modalwindow} from '../../services/modalwindow.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";

/**
 * a standard actionset item to open a model
 */
@Component({
    selector: 'object-action-modal-save-button',
    templateUrl: './src/objectcomponents/templates/objectactionmodalsavebutton.html',
    providers: [helper]
})
export class ObjectActionModalSaveButton {

    /**
     * emits the action. can emit save or savegodetail
     */
    @Output() public  actionemitter: EventEmitter<any> = new EventEmitter<any>();

    private actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal,  @Optional()private modalwindow: modalwindow) {}

    get displayLabel() {
        // see if we have a abel configured
        if(this.actionconfig.label) return this.actionconfig.label;

        // else standard labels
        return this.actionconfig.gorelated ? 'LBL_SAVE_AND_GO_TO_RECORD' : 'LBL_SAVE';
    }

    public execute() {
        if (this.model.validate()) {
            if (this.model.isNew && this.metadata.getModuleDuplicatecheck(this.model.module)) {
                this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                    modalRef.instance.messagelabel = 'LBL_CHECKING_DUPLICATES';
                    this.model.duplicateCheck(true).subscribe(dupdata => {
                        modalRef.instance.self.destroy();
                        if (dupdata.length > 0) {
                            this.model.duplicates = dupdata;
                            // this.modalContent.element.nativeElement.scrollTop = 0;
                            // this.showDuplicatesTable = true;
                            this.modal.confirm(this.language.getLabel('MSG_DUPLICATES_FOUND', null,'long'), this.language.getLabel('MSG_DUPLICATES_FOUND')).subscribe(confirmed => {
                                if (confirmed) this.saveModel();
                            });
                        } else {
                            this.saveModel();
                        }
                    });
                });
            } else {
                this.saveModel();
            }
        }
    }

    /**
     * save the model but without duplicate check
     *
     * @param goDetail if set to true the system will naviaget to the detail fo teh record after saving
     */
    private saveModel() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
            this.model.save(true).subscribe(status => {
                    this.model.endEdit();
                    if (status) {
                        /// if go Deail go to record)
                        if (this.actionconfig.gorelated) {
                            this.actionemitter.emit('savegodetail');
                        }
                    }
                    modalRef.instance.self.destroy();

                    // emit that we saved
                    this.actionemitter.emit('save');
                },
                error => {
                    modalRef.instance.self.destroy();
                });
        });
    }
}
