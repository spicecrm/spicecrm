/**
 * @module ModuleWorkflow
 */
import {Component, ElementRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {WorkflowManagerService} from '../services/workflowmanager.service';
import {WorkflowTaskTypeI} from '../interfaces/workflow.interfaces';
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
export class WorkflowManagerDetailTasks implements OnInit {

    /**
     * holds the selected task
     */
    public selectedTask: any;
    /**
     * reference to the diagram container
     */
    @ViewChild('diagramContainer', {read: ElementRef}) diagramContainer: ElementRef;
    /**
     * if true display diagram
     */
    public displayDiagram: boolean = false;

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

        this.workflowManagerService.sortTasksBySequence();
    }

    public ngOnInit() {
        this.workflowDiagramService.loadDiagram();
    }

    /**
     * adds a task
     */
    public addTask() {

        this.workflowManagerService.promptTaskType().subscribe((type: WorkflowTaskTypeI) => {
            if (!type) return;

            const newTask = this.workflowManagerService.generateNewTask(type);
            this.tasks = [...this.tasks, newTask];
            this.selectedTask = newTask;
        });
    }

    public toggleShowDiagram() {

        this.displayDiagram = !this.displayDiagram;
        if (this.displayDiagram) {

            this.workflowDiagramService.attachDiagram(this.diagramContainer.nativeElement);
        } else {
            this.workflowDiagramService.detachDiagram();
        }
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
