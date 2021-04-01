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
    Component,
    Pipe
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {Router}   from '@angular/router';


@Component({
    templateUrl: './src/modules/workflow/templates/workflowmanager.html'
})
export class WorkflowManager {
    private _current_module: string;
    private _current_workflow: string;
    private _current_workflow_data: any = {};
    public self: any = {};

    private workflowdefinitions: any[] = [];

    constructor(private backend: backend, private metadata: metadata, private language: language, private utils: modelutilities, private toast: toast, private router: Router) {}

    get modules() {
        return this.metadata.getModules().sort();
        // return this.appdata.modules;
    }

    set current_module(val: string) {
        if (val != this._current_module) {
            this._current_module = val;
            this._current_workflow = null;
            this.getWorkflows();
        }
    }

    get current_module() {
        return this._current_module;
    }

    get current_workflow() {
        return this._current_workflow;
    }

    set current_workflow(val: string) {
        this._current_workflow = val;
        this.getCurrentWorkflowData();
    }

    get current_rule_data() {
        return this._current_workflow_data;
    }

    private changeModule() {
        this.getWorkflows();
    }

    private getWorkflows() {
        this.workflowdefinitions = [];
        this.backend.getRequest('WorkflowDefinitons/' + this.current_module).subscribe(wfd => {
            this.workflowdefinitions = wfd;
        });
    }

    private getCurrentWorkflowData() {
        this.workflowdefinitions.some(data => {
            if (data.id == this.current_workflow) {
                this._current_workflow_data = this.utils.backendModel2spice('WorkflowDefinitions', data);
                return true;
            }
        });
    }

    /*
    private deleteWorkflow() {
        this.backend.deleteRequest('spiceui/core/modelvalidations/' + this.current_workflow).subscribe(
            (success) => {
                // this.broadcast.broadcastMessage('metadata.updatefieldsets', data);
                this.toast.sendToast('Workflow deleted');
                return true;
            },
            (error) => {
                this.toast.sendToast('removing Workflow failed!');
                console.error(error);
                return false;
            }
        );
    }
    */

    private save() {
        let data = this.utils.spiceModel2backend('WorkflowDefinitions', this._current_workflow_data);
        this.backend.postRequest('WorkflowDefinitons/' + this.current_module + '/' + this._current_workflow, {}, data).subscribe(
            (success) => {
                this.toast.sendToast('saved');
            },
            (error) => {
                this.toast.sendAlert('saving changes failed!');
            }
        );
    }

    private cancel() {
            this.self.destroy();
    }


    private addWorkflow() {
        let newGuid = this.utils.generateGuid();
        this.workflowdefinitions.push({
            id: newGuid,
            workflowdefinition_module: this.current_module,
            workflowdefinition_status: 'active',
            workflowdefinition_precond: 'a',
            tasks: [],
            conditions: []
        });
        this.current_workflow = newGuid;
    }


}
