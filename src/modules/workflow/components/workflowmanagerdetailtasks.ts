/**
 * @module ModuleWorkflow
 */
import {Component, Injector, Input, OnChanges} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from "../../../services/modal.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {WorkflowTaskType} from "../interfaces/workflow.interfaces";

/**
 * renders the task details view in the workflow manager
 */
@Component({
    selector: 'workflow-manager-detail-tasks',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasks.html',
})
export class WorkflowManagerDetailTasks {

    /**
     * holds the selected task
     */
    public selectedTask: any;

    constructor(private modal: modal,
                private model: model,
                private view: view,
                private injector: Injector,
                private workflowManagerService: WorkflowManagerService) {
    }

    /**
     * @return the workflow tasks from model data
     */
    get tasks() {
        return this.model.data.tasks;
    }

    /**
     * set the workflow data tasks
     * update the workflow manager service tasks
     * sort the tasks and set the selected task
     * @param data
     */
    @Input()
    set tasks(data) {
        this.model.data.tasks = data;
        this.workflowManagerService.tasks = data;

        this.sortTasksBySequence();
    }

    /**
     * set the selected task
     * @param task
     */
    public setSelectedTask(task) {
        this.selectedTask = task;
    }

    /**
     * sorts the tasks by the sequence
     */
    private sortTasksBySequence() {
        if (this.tasks) {
            this.tasks.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
        }
    }

    /**
     * adds a task
     */
    private addTask() {

        this.modal.openModal('WorkflowManagerTaskTypesModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.response.subscribe((type: WorkflowTaskType) => {

                if (!type) return;

                const newTask = {
                    id: this.model.generateGuid(),
                    workflowdefinition_id: this.model.id,
                    deleted: 0,
                    sequence: this.getNextSequence(),
                    name: 'new Task',
                    tasktype: type.name,
                    decisions: [],
                    systemactions: [],
                    primarytask: this.tasks.length == 0
                };
                this.tasks = [...this.tasks, newTask];
                this.selectedTask = newTask;
            });

        });
    }

    /**
     * helper function that loops over the tasks and gets the next available sequence number in an incremtne of 10
     */
    private getNextSequence() {
        let highestSequence = 0;

        for (let task of this.tasks) {
            if (task.deleted != 1 && parseInt(task.sequence, 10) > highestSequence) {
                highestSequence = parseInt(task.sequence, 10);
            }
        }

        return highestSequence + (10 - highestSequence % 10);
    }
}
