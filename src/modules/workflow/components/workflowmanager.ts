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
    templateUrl: '../templates/workflowmanager.html'
})
export class WorkflowManager {
    public _current_module: string;
    public _current_workflow: string;
    public _current_workflow_data: any = {};
    public self: any = {};

    public workflowdefinitions: any[] = [];

    constructor(public backend: backend, public metadata: metadata, public language: language, public utils: modelutilities, public toast: toast, public router: Router) {}

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

    public changeModule() {
        this.getWorkflows();
    }

    public getWorkflows() {
        this.workflowdefinitions = [];
        this.backend.getRequest('module/WorkflowDefinitions/' + this.current_module).subscribe(wfd => {
            this.workflowdefinitions = wfd;
        });
    }

    public getCurrentWorkflowData() {
        this.workflowdefinitions.some(data => {
            if (data.id == this.current_workflow) {
                this._current_workflow_data = this.utils.backendModel2spice('WorkflowDefinitions', data);
                return true;
            }
        });
    }

    /*
    public deleteWorkflow() {
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

    public save() {
        let data = this.utils.spiceModel2backend('WorkflowDefinitions', this._current_workflow_data);
        this.backend.postRequest('module/WorkflowDefinitions/' + this.current_module + '/' + this._current_workflow, {}, data).subscribe(
            (success) => {
                this.toast.sendToast('saved');
            },
            (error) => {
                this.toast.sendAlert('saving changes failed!');
            }
        );
    }

    public cancel() {
            this.self.destroy();
    }


    public addWorkflow() {
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
