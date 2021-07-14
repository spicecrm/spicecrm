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
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

import {objectmerge} from '../services/objectmerge.service';

/**
 * renders the content for the selection of the ducpliate fields and how they are to be merged
 */
@Component({
    selector: 'object-merge-modal-data',
    templateUrl: './src/include/spicemerge/templates/objectmergemodaldata.html',
    providers: [view]
})
export class ObjectMergeModalData {

    constructor(private view: view, private metadata: metadata, private modellist: modellist, private objectmerge: objectmerge, private model: model) {
        this.view.displayLabels = false;
    }

    /**
     * simple getter to check if a switch of the master is allowed
     */
    get canSwitchMaster() {
        return this.objectmerge.allowSwitchMaster;
    }

    /**
     * returns the selected items from teh listview
     *
     * @private
     */
    private getSelected() {
        return this.modellist.listData.list.filter(i => i.selected);
    }

    /**
     * reeturns true if called in the context of an active model and the model equasl teh current id
     *
     * @param id
     * @private
     */
    private isCurrentModel(id) {
        return this.model.id && (this.model.id == id || this.model.data.id == id);
    }

    /**
     * selects all fields
     * @param id
     * @private
     */
    private selectAllFields(id) {
        this.objectmerge.setAllfieldSources(id);
    }

    private showField(field) {
        for (let selected of this.getSelected()) {
            if (selected[field.name] != '') {
                return true;
            }
        }
        return false;
    }
}
