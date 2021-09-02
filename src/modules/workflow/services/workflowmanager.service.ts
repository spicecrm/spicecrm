/**
 * @module ModuleWorkflow
 */
import {Injectable} from '@angular/core';
import {WorkflowTaskType} from "../interfaces/workflow.interfaces";

/**
 * to share workflow manager task data with the components
 */
@Injectable()
export class WorkflowManagerService {
    /**
     * holds the workflow tasks
     */
    public tasks: any[] = [];
    /**
     * holds the workflow task types
     */
    public types: WorkflowTaskType[] = [];
    /**
     * holds the current module
     */
    public currentModule: { name: string, workflowDefinitions: any[] };
}
