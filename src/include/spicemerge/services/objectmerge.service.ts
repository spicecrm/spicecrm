/**
 * @module ObjectComponents
 */
import {Injectable} from '@angular/core';
import { metadata } from '../../../services/metadata.service';

@Injectable()
export class objectmerge {

    masterId: string = '';
    masterModule: string = '';
    mergeFields: Array<any> = [];
    mergeSource: any = {};

    constructor(private metadata: metadata) {
    }

    setModule(module){
        this.masterModule = module;
        this.getMergeFields();
    }

    getMergeFields(){
        this.mergeFields = []
        let modelFields = this.metadata.getModuleFields(this.masterModule);
        for(let mergeField in modelFields){
            if(modelFields.hasOwnProperty(mergeField) && modelFields[mergeField].duplicate_merge !== 'disabled' && modelFields[mergeField].source != 'non-db'&& modelFields[mergeField].type != 'id')
                this.mergeFields.push(modelFields[mergeField]);
        }

    }

    setAllfieldSources(masterId){
        this.mergeSource = {};
        for(let mergeField of this.mergeFields)
            this.mergeSource[mergeField.name] = masterId;
    }

}