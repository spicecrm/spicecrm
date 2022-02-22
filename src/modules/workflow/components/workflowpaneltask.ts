/**
 * @module ModuleWorkflow
 */
import {
    Component, Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';
import {toast} from '../../../services/toast.service';


@Component({
    selector: 'workflow-panel-task',
    templateUrl: '../templates/workflowpaneltask.html'

})
export class WorkflowPanelTask {

    @Input() public workflowtask: any = {};
    @Input() public workflow: any = {};
    public comment: string = '';
    public posting: boolean = false;

    constructor(public model: model, public workflowservice: workflow, public language: language, public broadcast: broadcast, public toast: toast, public modelutilities: modelutilities) {

    }

    public addComment() {
        this.posting = true;
        this.workflowservice.addComment(this.workflowtask.id, this.comment).subscribe(result => {
            this.posting = false;
            this.comment = '';
            this.toast.sendToast('Comment has been saved');
        });
    }

    public doAction(action) {
        this.posting = true;
        this.workflowservice.doTaskAction(this.workflowtask.id, action, this.comment).subscribe(parent => {

            this.model.setData(parent);

            /**
             * broadcast that we saved the model
             */
            this.broadcast.broadcastMessage('model.save', {
                id: this.model.id,
                module: this.model.module,
                data: this.model.data
            });

            /**
             * broadcast that we updated the workflowtask
             * this is mainly important so the assistant and other objects that might old it can also pick up the changes
             */
            this.broadcast.broadcastMessage('model.save', {
                id: this.workflowtask.id,
                module: 'WorkflowTasks',
                data: {}
            });

            this.posting = false;
            this.comment = '';
            this.toast.sendToast('Workflow updated');
        });
    }

    get showComment() {
        return this.workflowtask.enablecomments == '1' && parseInt(this.workflowtask.status, 10) >= 10;
    }
}
