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

    constructor(private backend: backend, private broadcast: broadcast) {
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

        this.backend.getRequest('Workflows/forparent/' + module + '/' + id).subscribe(workflows => {

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
        this.backend.postRequest('Workflows/addcomment/' + taskid, {}, {comment: comment}).subscribe(workflow => {

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
     * @param actionvalue
     * @param comment
     */
    public doTaskAction(taskid, actionvalue, comment = '') {
        let retSubject = new Subject<any>();
        this.backend.postRequest('Workflows/settaskstatus/' + taskid + '/' + actionvalue, {}, {comment: comment}).subscribe(workflow => {

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
    private broadcastOpenCount() {
        this.broadcast.broadcastMessage('workflows.loaded', {
            module: this.module,
            id: this.id,
            workflowcount: this.activeCount
        });
    }
}
