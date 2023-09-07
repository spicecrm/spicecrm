/**
 * @module ModuleWorkflow
 */
import {
    Injectable
} from '@angular/core';
import {Subject} from 'rxjs';
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";
import {toast} from "../../../services/toast.service";

/**
 * a helper service for the workflow handler
 */
@Injectable()
export class workflow {
    public workflows: any[] = [];
    public manualDefinitions: {id: string, name: string}[] = [];
    public module: string = '';
    public id: string = '';
    public loading: boolean = false;
    /**
     * holds the id if the currently processing workflow definition
     */
    public processing: string;

    constructor(public backend: backend,
                private toast: toast,
                public broadcast: broadcast) {
    }

    /**
     * returns the number of completed workflows
     */
    get completeCount(){
        return this.workflows.filter(w => parseInt(w.workflow_status, 10) >= 30).length;
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
     * get manual processable definitions
     */
    public getManualDefinitions() {

        this.loading = true;

        this.backend.getRequest(`module/WorkflowDefinitions/manual/processable/forModule/${this.module}/${this.id}`).subscribe({
            next: definitions => {
                this.loading = false;
                this.manualDefinitions = definitions;
            },
            error: () => {
                this.loading = false;
            }
        });
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
                    wf.workflowtasks = workflow.workflowtasks;
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
    public callTaskMethod(taskid, method: string, params: any) {
        let retSubject = new Subject<any>();

        this.backend.postRequest(`module/WorkflowsTaskTypes/${method}/workflowtask/${taskid}`, {}, params).subscribe({
            next : (workflow) => {

                this.workflows.some(wf => {
                    if (wf.id == workflow.workflow.id) {
                        wf.workflow_status = workflow.workflow.workflow_status;
                        wf.workflowtasks = workflow.workflow.workflowtasks;
                        return true;
                    }
                });

                this.broadcastOpenCount();

                retSubject.next(workflow.parent);
                retSubject.complete();
            }
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

    /**
     * process manual workflow
     * @param definitionId
     */
    public processManualWorkflow(definitionId: string) {

        this.processing = definitionId;

        this.backend.postRequest(`module/WorkflowDefinitions/${definitionId}/processWorkflow/${this.id}`).subscribe({
            next: res => {
                this.processing = undefined;
                if (res) {
                    this.getWorkflowsForModule(this.module, this.id);
                    this.getManualDefinitions();
                    this.toast.sendToast('MSG_SUCCESSFULLY_EXECUTED', 'success');
                } else {
                    this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                }
            },
            error: () => {
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                this.processing = undefined;
            }
        });
    }

}
