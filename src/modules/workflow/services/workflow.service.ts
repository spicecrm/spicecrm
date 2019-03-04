/**
 * @module ModuleWorkflow
 */
import {
    Injectable
} from '@angular/core';
import {Subject} from 'rxjs';
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";


@Injectable()
export class workflow
{
    workflows: Array<any> = [];
    module: string = '';
    id: string = '';
    loading: boolean = false;

    constructor(private backend: backend, private broadcast: broadcast) {}

    getWorkflowsForModule(module, id){

        this.module = module;
        this.id = id;

        let retSubject = new Subject<any>();

        this.loading = true;

        this.backend.getRequest('Workflows/forparent/'+module+'/'+id).subscribe(workflows => {

            this.workflows = workflows;

            retSubject.next(workflows);
            retSubject.complete();

            this.broadcastOpenCount();

            this.loading = false;
        })

        return retSubject.asObservable();
    }


    addComment(taskid,  comment = ''){
        let retSubject = new Subject<any>();
        this.backend.postRequest('Workflows/addcomment/'+taskid, {}, {comment:comment}).subscribe(workflow => {

            this.workflows.some(wf => {
                if(wf.id == workflow.id){
                    wf.workflow_status = workflow.workflow_status;
                    wf.worflowtasks = workflow.worflowtasks;
                    return true;
                }
            })

            retSubject.next(workflow);
            retSubject.complete();

        })
        return retSubject.asObservable();
    }

    doTaskAction(taskid, actionvalue, comment = ''){
        let retSubject = new Subject<any>();
        this.backend.postRequest('Workflows/settaskstatus/'+taskid+'/'+actionvalue, {}, {comment:comment}).subscribe(workflow => {

            this.workflows.some(wf => {
                if(wf.id == workflow.workflow.id){
                    wf.workflow_status = workflow.workflow.workflow_status;
                    wf.worflowtasks = workflow.workflow.worflowtasks;
                    return true;
                }
            })

            retSubject.next(workflow.parent);
            retSubject.complete();

            this.broadcastOpenCount();
        })
        return retSubject.asObservable();
    }

    get activeCount(){
        let count = 0;
        for(let workflow of this.workflows){
            if(parseInt(workflow.workflow_status) < 30)
                count++;
        }
        return count;
    }

    broadcastOpenCount(){
        this.broadcast.broadcastMessage('workflows.loaded', {module: this.module, id: this.id, workflowcount: this.activeCount});
    }
}