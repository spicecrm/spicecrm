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
import {Component, Input, OnInit, EventEmitter, Output, SkipSelf} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';

import {objectmerge} from '../services/objectmerge.service';
import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'object-merge-modal',
    templateUrl: './src/include/spicemerge/templates/objectmergemodal.html',
    providers: [model, modellist, objectmerge]
})
export class ObjectMergeModal implements OnInit {

    /**
     * a lit of models to be merged
     */
    @Input() private mergemodels: any[] = [];

    /**
     * an event emitter that the merge has happened
     * ToDo: check if that is still required
     */
    @Output() private merged$: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the current merge step
     */
    private currentMergeStep: number = 0;

    /**
     * the merge steps available
     */
    private mergeSteps: string[] = ['records', 'fields', 'execute'];

    /**
     * reference to self
     */
    private self: any;

    constructor(private language: language, private metadata: metadata, private objectmerge: objectmerge, @SkipSelf() private parentmodel: model,private model: model, private modellist: modellist, private backend: backend, private modal: modal) {

    }

    public ngOnInit() {

        // set the model data
        this.model.id = this.parentmodel.id;
        this.model.module = this.parentmodel.module;
        this.model.data = this.parentmodel.data;


        // set the modellist module
        this.modellist._module = this.model.module;
        this.modellist.setListType('all', false, [], false);

        // set the master id
        this.objectmerge.setModule(this.model.module);
        this.objectmerge.masterId = this.model.id;
        this.objectmerge.setAllfieldSources(this.model.id);

        // select the current model and add to the list
        this.model.data.selected = true;

        // just to be sure
        this.model.data.id = this.model.id;

        // push the record
        this.modellist.listData.list.push(this.model.data);

        // add the other models to the list
        for (let mergemodel of this.mergemodels) {
            this.modellist.listData.list.push(mergemodel);
        }

    }

    /**
     * closes the modal
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     *
     */
    private getCurrentStep() {
        return this.mergeSteps[this.currentMergeStep];
    }

    private getStepClass(convertStep) {
        let thisIndex = this.mergeSteps.indexOf(convertStep);
        if (thisIndex == this.currentMergeStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.currentMergeStep) {
            return 'slds-is-completed';
        }
    }

    private getStepComplete(convertStep) {
        let thisIndex = this.mergeSteps.indexOf(convertStep);
        if (thisIndex < this.currentMergeStep) {
            return true;
        }
        return false;
    }

    get progressBarWidth() {
        return {
            width: (this.currentMergeStep / (this.mergeSteps.length - 1) * 100) + '%'
        };
    }

    private nextStep() {
        if (this.currentMergeStep < this.mergeSteps.length - 1) {
            switch (this.currentMergeStep) {
                default:
                    this.currentMergeStep++;
                    break;
            }
        } else {

            // grab fields to override with other beans
            let fields = {};
            for (let field of this.objectmerge.mergeFields) {
                if (this.objectmerge.mergeSource[field.name] != this.objectmerge.masterId) {
                    fields[field.name] = this.objectmerge.mergeSource[field.name];
                }
            }

            // grab bean ids from selected beans in list
            let toDeleteBeanIds = [];
            for (let toDeleteBean of this.modellist.listData.list) {
                if (toDeleteBean.id != this.objectmerge.masterId && toDeleteBean.selected) {
                    toDeleteBeanIds.push(toDeleteBean.id);
                }
            }

            //
            this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                modalRef.instance.messagelabel = 'LBL_MERGING';
                this.backend.postRequest('module/' + this.model.module + '/' + this.objectmerge.masterId + '/merge_bean', {}, {fields, toDeleteBeanIds}).subscribe(restdata => {
                    // close the loading modal
                    modalRef.instance.self.destroy();
                    if (this.model.id != this.objectmerge.masterId) {
                        this.model.id = this.objectmerge.masterId;
                        this.model.goDetail();
                    } else {
                        this.merged$.emit(true);
                        this.merged$.complete();
                    }

                    // close the modal
                    this.closeModal();
                });
            });
        }
    }

    get prevDisabled() {
        return this.currentMergeStep === 0;
    }

    get nextDisabled() {
        switch (this.currentMergeStep) {
            case 0:
                if (this.modellist.getSelectedCount() > 1) {
                    return false;
                } else {
                    return true;
                }
            default:
                return false;
        }
    }

    private prevStep() {
        if (this.currentMergeStep > 0) {
            this.currentMergeStep--;
        }
    }


}
