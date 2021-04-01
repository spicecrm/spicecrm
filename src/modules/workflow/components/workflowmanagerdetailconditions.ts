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
 * @module ModuleWorkflow
 */
import {
    Component, Input
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

declare var _: any;

/**
 * renders the conditions panel for a given workflow
 */
@Component({
    selector: 'workflow-manager-detail-conditions',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailconditions.html',
    providers: [view]
})
export class WorkflowManagerDetailConditions {

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.view.displayLabels = false;
    }

    /**
     * getter for teh conditions stored on the workflow definition
     */
    get conditions() {
        // get from the model
        return this.model.getField('conditions');
    }

    /**
     * simple setter for the conditions
     *
     * @param conditions
     */
    set conditions(conditions) {
        this.model.setField('conditions', conditions);
    }

    /**
     * getter for the conditions to end the workflow stored on the workflow definition
     */
    get conditions_end() {
        return this.model.getField('conditions_end');
    }

    /**
     * simple setter for eht conditions to end the workflow
     * @param conditions
     */
    set conditions_end(conditions) {
        this.model.setField('conditions_end', conditions);
    }

    /**
     * a simple getter for the module
     */
    get module() {
        return this.model.getField('workflowdefinition_module');
    }
}
