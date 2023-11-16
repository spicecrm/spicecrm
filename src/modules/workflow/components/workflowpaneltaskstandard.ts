/**
 * @module ModuleWorkflow
 */
import {
    Component, Input
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';
import {toast} from '../../../services/toast.service';


@Component({
    selector: 'workflow-panel-task-standard',
    templateUrl: '../templates/workflowpaneltaskstandard.html'

})
export class WorkflowPanelTaskStandard {
    /**
     * holds the task data passed from parent
     */
    public taskData: any = {};
    /**
     * true if posting data to backend
     */
    public posting: boolean = false;

    /**
     * holds the task comment content
     */
    public comment: string = '';

    constructor(private workflowservice: workflow, private language: language, private broadcast: broadcast, private toast: toast, private modelutilities: modelutilities) {

    }

    /**
     * return true if commenting enabled
     */
    get showComment(): boolean {
        return this.taskData.enablecomments == '1' && parseInt(this.taskData.workflowtask_status, 10) >= 10;
    }


    /**
     * add a new comment
     */
    public addComment() {
        this.posting = true;
        this.workflowservice.addComment(this.taskData.id, this.comment).subscribe(result => {
            this.posting = false;
            this.comment = '';
            this.toast.sendToast('Comment has been saved');
        });
    }

    /**
     * set the task status
     * @param status
     */
    public setStatus(status: string) {
        this.posting = true;
        this.workflowservice.callTaskMethod(this.taskData.id, 'setStatus', {status: status, comment: this.comment}).subscribe(parent => {
            this.taskData.workflowtask_status = status;
            /**
             * broadcast that we saved the model
             */
            this.broadcast.broadcastMessage('model.save', {
                module: this.workflowservice.module
            });

            /**
             * broadcast that we updated the taskData
             * this is mainly important so the assistant and other objects that might old it can also pick up the changes
             */
            this.broadcast.broadcastMessage('model.save', {
                id: this.taskData.id,
                module: 'WorkflowTasks',
                data: this.taskData
            });

            this.posting = false;
            this.toast.sendToast('Workflow updated');
        });
    }
}
