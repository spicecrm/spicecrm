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
            tasks: [],
            conditions: []
        });
        this.current_workflow = newGuid;
    }


}


@Pipe({
    name: 'notdeleted',
    pure: false
})
export class notdeletedpipe {
    public transform(values) {
        let retvalues = [];

        for (let value of values) {
            if (value.deleted != 1) {
                retvalues.push(value);
            }
        }

        return retvalues;
    }
}
