/**
 * @module ModuleWorkflow
 */
import {
    Injectable
} from '@angular/core';
import {Subject} from 'rxjs';
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";

/**
 * a helper servioe for the workflow handler
 */
@Injectable()
export class workflow {
    public workflows: any[] = [];
    public module: string = '';
    public id: string = '';
    public loading: boolean = false;

    constructor(public backend: backend, public broadcast: broadcast) {
    }

    /**
     * retrieves the workflows for a given model
     *
     * @param module
     * @param id
     */
    public getWorkflowsForModule(module, id) {

        this.module = module;
        this.id = id;

        let retSubject = new Subject<any>();

        this.loading = true;

        this.backend.getRequest('module/Workflows/forparent/' + module + '/' + id).subscribe(workflows => {

            this.workflows = workflows;

            retSubject.next(workflows);
            retSubject.complete();

            this.broadcastOpenCount();

            this.loading = false;
        });

        return retSubject.asObservable();
    }


    /**
     * adds a comment entered by the user to the workflowtask
     *
     * @param taskid
     * @param comment
     */
    public addComment(taskid, comment = '') {
        let retSubject = new Subject<any>();
        this.backend.postRequest('module/Workflows/addcomment/' + taskid, {}, {comment: comment}).subscribe(workflow => {

            this.workflows.some(wf => {
                if (wf.id == workflow.id) {
                    wf.workflow_status = workflow.workflow_status;
                    wf.worflowtasks = workflow.worflowtasks;
                    return true;
                }
            });

            retSubject.next(workflow);
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

    /**
     * handles an activity on the workflow task
     *
     * @param taskid
     * @param method
     * @param methodParams
     */
    public callTaskMethod(taskid, method: string, methodParams: any[]) {
        let retSubject = new Subject<any>();
        const params = {methodParams};

        this.backend.postRequest(`module/WorkflowsTaskTypes/${method}/workflowtask/${taskid}`, {}, params).subscribe(workflow => {

            this.workflows.some(wf => {
                if (wf.id == workflow.workflow.id) {
                    wf.workflow_status = workflow.workflow.workflow_status;
                    wf.worflowtasks = workflow.workflow.worflowtasks;
                    return true;
                }
            });

            retSubject.next(workflow.parent);
            retSubject.complete();

            this.broadcastOpenCount();
        })
        return retSubject.asObservable();
    }

    /**
     * returns the count of active workflows
     */
    get activeCount() {
        let count = 0;
        for (let workflow of this.workflows) {
            if (parseInt(workflow.workflow_status, 10) < 30) {
                count++;
            }
        }
        return count;
    }

    /**
     * broadcasts the number of open workflows found
     */
    public broadcastOpenCount() {
        this.broadcast.broadcastMessage('workflows.loaded', {
            module: this.module,
            id: this.id,
            workflowcount: this.activeCount
        });
    }
}
