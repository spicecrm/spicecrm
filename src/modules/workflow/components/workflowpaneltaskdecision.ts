/**
 * @module ModuleWorkflow
 */
import {Component} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';
import {toast} from '../../../services/toast.service';


@Component({
    selector: 'workflow-panel-task-decision',
    templateUrl: '../templates/workflowpaneltaskdecision.html'

})
export class WorkflowPanelTaskDecision {
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
     * set task decision
     * @param id
     */
    public setDecision(id: string) {
        this.posting = true;
        this.workflowservice.callTaskMethod(this.taskData.id, 'setDecision', {decisionId: id, comment: this.comment}).subscribe(parent => {
            /**
             * broadcast that we updated the workflowtask
             * this is mainly important so the assistant and other objects that might old it can also pick up the changes
             */
            this.broadcast.broadcastMessage('model.save', {
                id: this.taskData.id,
                module: 'WorkflowTasks',
                data: {}
            });

            this.posting = false;
            this.toast.sendToast('Workflow updated');
        });
    }
}
