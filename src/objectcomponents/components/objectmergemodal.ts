/**
 * @module ObjectComponents
 */
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { modellist } from '../../services/modellist.service';
import { language } from '../../services/language.service';
import { modal } from '../../services/modal.service';
import { backend } from '../../services/backend.service';

import { objectmerge } from '../services/objectmerge.service';
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'object-merge-modal',
    templateUrl: './src/objectcomponents/templates/objectmergemodal.html',
    providers: [model, modellist, objectmerge],
    styles: [
        ':host >>> .slds-progress__marker global-button-icon svg {fill:#CA1B1F}',
        ':host >>> .slds-progress__marker:hover global-button-icon svg {fill:#FD595D}',
        ':host >>> .slds-progress__marker:active global-button-icon svg {fill:#FD595D}',
        ':host >>> .slds-progress__marker:focus global-button-icon svg {fill:#FD595D}',
    ]
})
export class ObjectMergeModal implements OnInit{

    @Input() mergemodels: Array<any> = [];
    @Output() merged$: EventEmitter<boolean> = new EventEmitter<boolean>();

    currentMergeStep: number = 0;
    mergeSteps: Array<any> = ['records', 'fields', 'execute'];
    parentmodel: any = {};
    self: any = {};

    constructor( private language: language, private metadata: metadata, private objectmerge: objectmerge, private model: model,  private modellist: modellist,  private backend: backend, private modal: modal ) {

    }

    ngOnInit(){

        // set the model data
        this.model.id = this.parentmodel.id;
        this.model.module = this.parentmodel.module;
        this.model.data = this.parentmodel.data;


        // set the modellist module
        this.modellist.module = this.model.module;

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
        for(let mergemodel of this.mergemodels) {
            this.modellist.listData.list.push(mergemodel);
        }

    }

    closeModal(){
        this.self.destroy();
    }

    getCurrentStep() {
        return this.mergeSteps[this.currentMergeStep];
    }

    getStepClass(convertStep) {
        let thisIndex = this.mergeSteps.indexOf(convertStep);
        if (thisIndex == this.currentMergeStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.currentMergeStep) {
            return 'slds-is-completed';
        }
    }

    getStepComplete(convertStep) {
        let thisIndex = this.mergeSteps.indexOf(convertStep);
        if (thisIndex < this.currentMergeStep) {
            return true;
        }
        return false;
    }

    getProgressBarWidth() {
        return {
            width: (this.currentMergeStep / (this.mergeSteps.length - 1) * 100) + '%'
        }
    }

    nextStep() {
        if(this.currentMergeStep < this.mergeSteps.length - 1) {
            switch (this.currentMergeStep) {
                default:
                    this.currentMergeStep++;
                    break;
            }
        } else {

            //grab fields to override with other beans
            let fields = {};
            for(let field of this.objectmerge.mergeFields){
                if(this.objectmerge.mergeSource[field.name] != this.objectmerge.masterId)
                    fields[field.name] = this.objectmerge.mergeSource[field.name];
            }

            //grab bean ids from selected beans in list
            let toDeleteBeanIds = [];
            for(let toDeleteBean of this.modellist.listData.list){
                if(toDeleteBean.id != this.objectmerge.masterId)
                    toDeleteBeanIds.push(toDeleteBean.id);
            }

            //
            this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                modalRef.instance.messagelabel = 'LBL_MERGING';
                this.backend.postRequest('module/'+this.model.module + '/' + this.objectmerge.masterId + '/merge_bean', {}, {"fields": fields, "toDeleteBeanIds": toDeleteBeanIds}).subscribe(restdata => {
                    // close the loading modal
                    modalRef.instance.self.destroy();
                    if(this.model.id != this.objectmerge.masterId){
                        this.model.id = this.objectmerge.masterId;
                        this.model.goDetail()
                    } else {
                        this.merged$.emit(true);
                        this.merged$.complete();
                    }

                    // close the modal
                    this.closeModal();
                });
            })
        }
    }

    prevDisabled(){
       return this.currentMergeStep === 0;
    }

    nextDisabled(){
        switch (this.currentMergeStep) {
            case 0:
                if(this.modellist.getSelectedCount() > 1)
                    return false;
                else
                    return true;
            default:
                return false;
        }
    }

    prevStep() {
        if (this.currentMergeStep > 0)
            this.currentMergeStep--;
    }


}