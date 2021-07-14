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
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';

/**
 * renders a list of records if we want to offer the user a choice of duplicates to be selected for the merge
 * this is whenit comes fromt eh duplicates panel
 */
@Component({
    selector: 'object-merge-modal-records',
    templateUrl: './src/include/spicemerge/templates/objectmergemodalrecords.html',
})
export class ObjectMergeModalRecords {

    /**
     * the fields for the list
     *
     * @private
     */
    private listFields: any[] = [];

    constructor(private metadata: metadata, private model: model, private modellist: modellist) {
        let componentconfig = this.metadata.getComponentConfig('ObjectMergeModalRecords', this.model.module);
        let allFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allFields) {
            if (listField.fieldconfig.default !== false) {
                this.listFields.push(listField);
            }
        }

    }

    /**
     * reeturns true if called in the context of an active model and the model equasl teh current id
     *
     * @param id
     * @private
     */
    private isCurrentModel(id) {
        return this.model.id && this.model.id == id;
    }

    /**
     * if we have one model set as master as we trigger the process coming form that model
     * this will disable the select option for this column as the main model needs to be part of the merge and cannotbe unselected
     *
     * @param data
     * @private
     */
    private disableSelect(data) {
        if (data.id == this.model.id || !data.acl?.delete) {
            return true;
        } else {
            return false;
        }
    }

}
