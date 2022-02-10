/**
 * @module ModuleWorkflow
 */
import {Component, Injector, Input} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {WorkflowManagerService} from '../services/workflowmanager.service';
import {WorkflowTaskDefinitionI, WorkflowTaskTypeI} from '../interfaces/workflow.interfaces';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {libloader} from '../../../services/libloader.service';
import {WorkflowDiagramService} from "../services/workflowdiagram.service";

/**
 * renders the task details view in the workflow manager
 */
@Component({
    selector: 'workflow-manager-detail-tasks',
    templateUrl: '../templates/workflowmanagerdetailtasks.html',
})
export class WorkflowManagerDetailTasks {

    /**
     * holds the selected task
     */
    public selectedTask: any;

    constructor(public modal: modal,
                public model: model,
                public view: view,
                public injector: Injector,
                public libLoader: libloader,
                public workflowDiagramService: WorkflowDiagramService,
                public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * @return the workflow tasks from model data
     */
    get tasks() {
        return this.model.data.tasks ?? [];
    }

    /**
     * set the workflow data tasks
     * update the workflow manager service tasks
     * sort the tasks and set the selected task
     * @param data
     */
    @Input()
    set tasks(data: WorkflowTaskDefinitionI[]) {
        this.model.data.tasks = data;
        this.workflowManagerService.tasks = data;

        this.workflowManagerService.sortTasksBySequence();
    }

    /**
     * adds a task
     */
    public addTask() {

        this.workflowManagerService.promptTaskType().subscribe((type: WorkflowTaskTypeI) => {
            if (!type) return;

            const newTask = this.workflowManagerService.generateNewTask(type.id);
            this.tasks = [...this.tasks, newTask];
            this.selectedTask = newTask;
        });
    }

    /**
     * set the selected task
     * @param task
     */
    public setSelectedTask(task) {
        this.selectedTask = task;
    }

    /**
     * rearrange the tasks by sequence
     * @param event
     */
    public onDrop(event: CdkDragDrop<any>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.tasks = event.container.data.map((task, index) => {
            task.sequence = (index + 1) * 10;
            return task;
        });
    }
}
