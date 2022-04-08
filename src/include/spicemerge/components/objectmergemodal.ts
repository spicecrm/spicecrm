/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit, EventEmitter, Output, SkipSelf} from '@angular/core';
import {Router} from "@angular/router";
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {broadcast} from '../../../services/broadcast.service';

import {objectmerge} from '../services/objectmerge.service';
import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'object-merge-modal',
    templateUrl: '../templates/objectmergemodal.html',
    providers: [model, modellist, objectmerge]
})
export class ObjectMergeModal implements OnInit {

    /**
     * a list of models to be merged
     */
    @Input() public mergemodels: any[] = [];

    /**
     * the current merge step
     */
    public currentMergeStep: number = 0;

    /**
     * the merge steps available
     */
    public mergeSteps: string[] = ['records', 'fields', 'execute'];

    /**
     * reference to self
     */
    public self: any;

    constructor(public broadcast: broadcast, public router: Router, public metadata: metadata, public objectmerge: objectmerge, @SkipSelf() public parentmodel: model, public model: model, public modellist: modellist, public backend: backend, public modal: modal) {

    }

    public ngOnInit() {

        // set the model data
        this.model.module = this.parentmodel.module;

        // set the modellist module
        this.modellist.module = this.model.module;
        this.modellist.setListType('all', false);

        // set the module in teh merge service
        this.objectmerge.setModule(this.model.module);

        // if we have a parentmodel id add this as the master
        if (this.parentmodel.id) {
            this.model.id = this.parentmodel.id;
            this.model.setData(this.parentmodel.data, false);

            // set the master id
            this.objectmerge.masterId = this.model.id;
            this.objectmerge.setAllfieldSources(this.model.id);

            // set that we do not allow the swicth of the master
            this.objectmerge.allowSwitchMaster = this.parentmodel.checkAccess('delete');

            // select the current model and add to the list
            this.model.setField('selected', true);

            // just to be sure
            // this.model.data.id = this.model.id;

            // push the record
            this.modellist.listData.list.push(this.model.data);
        } else {
            // go to step 2
            this.mergeSteps = ['fields', 'execute'];

            // check if all can be deleted
            if (this.mergemodels.length == this.mergemodels.filter(m => m.acl?.delete).length) {
                // set the master id
                this.objectmerge.masterId = this.mergemodels[0].id;
            } else {
                // find the first we cannot delete
                this.objectmerge.masterId = this.mergemodels.find(m => !m.acl?.delete).id;

                // set that we do not allow the swicth of the master
                this.objectmerge.allowSwitchMaster = false;
            }

            // set the default for all fields from this one
            this.objectmerge.setAllfieldSources(this.objectmerge.masterId);
        }

        // add the other models to the list
        for (let mergemodel of this.mergemodels) {
            this.modellist.listData.list.push(mergemodel);
        }
    }

    /**
     * closes the modal
     */
    public closeModal() {
        this.self.destroy();
    }

    /**
     *
     */
    public getCurrentStep() {
        return this.mergeSteps[this.currentMergeStep];
    }

    public nextStep() {
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
            let duplicates = [];
            for (let duplicate of this.modellist.listData.list) {
                if (duplicate.id != this.objectmerge.masterId && duplicate.selected) {
                    duplicates.push(duplicate.id);
                }
            }

            //
            this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                modalRef.instance.messagelabel = 'LBL_MERGING';
                this.backend.postRequest(`module/${this.model.module}/${this.objectmerge.masterId}/mergebeans`, {}, {
                    fields,
                    duplicates
                }).subscribe(response => {
                    // close the loading modal
                    modalRef.instance.self.destroy();

                    // emit the model save
                    this.broadcast.broadcastMessage('model.save', {
                        id: this.objectmerge.masterId,
                        module: this.model.module,
                        data: response.data
                    });

                    // emit the model merge message
                    this.broadcast.broadcastMessage('model.merge', {
                        id: this.objectmerge.masterId,
                        module: this.model.module
                    });

                    // emit the model delete
                    for (let duplicate of duplicates) {
                        this.broadcast.broadcastMessage('model.delete', {
                            id: duplicate,
                            module: this.model.module
                        });
                    }

                    // if we switched master .. navigate to the new master
                    if(this.model.id && this.model.id != this.objectmerge.masterId){
                        this.router.navigate([`/module/${this.model.module}/${this.objectmerge.masterId}`]);
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
                return this.modellist.getSelectedCount() <= 1;
            default:
                return false;
        }
    }

    public prevStep() {
        if (this.currentMergeStep > 0) {
            this.currentMergeStep--;
        }
    }

}
