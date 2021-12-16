/**
 * @module ObjectComponents
 */
import {Injectable} from '@angular/core';
import {metadata} from '../../../services/metadata.service';

/**
 * a simple helper service to manage the merge of the models
 */
@Injectable()
export class objectmerge {

    /**
     * the id of the master record
     */
    public masterId: string = '';

    /**
     * inicates that we can swithc the master. This is not allowed if we have a model that cannot be deleted and is thus set to the master
     *
     * @private
     */
    public allowSwitchMaster: boolean = true;

    /**
     * the module of the master record we are merging into
     */
    public masterModule: string = '';

    /**
     * the fields to merge
     */
    public mergeFields: any[] = [];

    /**
     * the soruce from where a field shoudld be taken during the merge of the beans
     */
    public mergeSource: any = {};

    constructor(public metadata: metadata) {
    }

    /**
     * sets the module and laods the fields that are to be considered in a merge
     *
     * @param module
     */
    public setModule(module: string) {
        this.masterModule = module;
        this.getMergeFields();
    }

    /**
     * retrieves and filters the merge fields
     *
     * @private
     */
    public getMergeFields() {
        this.mergeFields = [];
        let modelFields = this.metadata.getModuleFields(this.masterModule);
        for (let mergeField in modelFields) {
            if (modelFields.hasOwnProperty(mergeField) && modelFields[mergeField].duplicate_merge !== 'disabled' && modelFields[mergeField].source != 'non-db' && modelFields[mergeField].type != 'id') {
                this.mergeFields.push(modelFields[mergeField]);
            }
        }

    }

    /**
     * sets all fields oruces to one signel master
     *
     * @param masterId
     * @private
     */
    public setAllfieldSources(masterId) {
        this.mergeSource = {};
        for (let mergeField of this.mergeFields) {
            this.mergeSource[mergeField.name] = masterId;
        }
    }

}
