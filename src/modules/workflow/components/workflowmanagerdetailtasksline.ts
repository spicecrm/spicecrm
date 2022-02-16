/**
 * @module ModuleWorkflow
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {WorkflowTaskDefI, WorkflowTaskTypeI} from "../interfaces/workflow.interfaces";
import {modal} from "../../../services/modal.service";


@Component({
    selector: '[workflow-manager-detail-tasks-line]',
    templateUrl: '../templates/workflowmanagerdetailtasksline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTasksLine {
    /**
     * holds the task data
     */
    @Input() public task: WorkflowTaskDefI;
    /**
     * holds the task type data
     */
    public type: WorkflowTaskTypeI;
    /**
     * emit delete action
     */
    @Output() public deleted$ = new EventEmitter<void>();
    /**
     * emit add next task action
     */
    @Output() public addNextTask$ = new EventEmitter<void>();

    constructor(public workflowManagerService: WorkflowManagerService, public modal: modal, public language: language) {
    }

    public ngOnChanges() {
        if (!this.task) return;
        this.type = this.workflowManagerService.getType(this.task.tasktype);
    }

    /**
     * Deletes the task
     */
    public removeTask() {
        this.modal.confirm(
            this.language.getLabel('MSG_DELETE_RECORD', '', 'long'),
            this.language.getLabel('MSG_DELETE_RECORD'))
            .subscribe((answer) => {
                if (answer) {
                    this.workflowManagerService.deleteTask(this.task.id);
                    this.deleted$.next();
                }
            });
    }

    /**
     * emit add task
     */
    public addTask() {
        this.addNextTask$.next();
    }
}
