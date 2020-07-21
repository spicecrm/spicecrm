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
