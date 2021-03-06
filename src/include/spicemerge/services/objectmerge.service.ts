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

    constructor(private metadata: metadata) {
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
    private getMergeFields() {
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
