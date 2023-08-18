/**
 * @module ModuleWorkflow
 */
import {Component,} from '@angular/core';
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {WorkflowTaskTypeCloseWorkflowsI} from "../interfaces/workflow.interfaces";


/**
 * handle managing the workflow task close other workflows type
 */
@Component({
    selector: 'workflow-manager-task-types-close-workflows',
    templateUrl: '../templates/workflowmanagertasktypescloseworkflows.html',
})
export class WorkflowManagerTaskTypesCloseWorkflows {

    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService) {
        this.initialize();
    }

    /**
     * local property for workflow definition ids getter setter
     */
    public _ids: string[] = [];

    /**
     * get the workflow definition ids
     */
    get ids() {
        return this._ids;
    }

    /**
     * set the workflow definition ids
     * @param val
     */
    set ids(val) {
        this._ids = val;
        this.config.workflowDefinitionIds = val.join(',');
    }

    /**
     * get the workflow definition closeAll
     */
    get closeAll() {
        return this.config.closeAll;
    }

    /**
     * set the workflow definition closeAll
     * @param val
     */
    set closeAll(val) {

        this.config.closeAll = val;

        if (this.config.closeAll) {
            this.config.workflowDefinitionIds = '';
        }
    }

    /**
     * get type config
     */
    get config(): WorkflowTaskTypeCloseWorkflowsI {
        return this.model.data.type_config;
    }

    /**
     * set the initial ids value from the definition
     * @private
     */
    private initialize() {
        if (!!this.model.data.type_config.workflowDefinitionIds) {
            this.ids = this.model.data.type_config.workflowDefinitionIds.split(',');
        }
    }
}
