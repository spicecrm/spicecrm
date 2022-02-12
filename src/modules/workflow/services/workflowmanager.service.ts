/**
 * @module ModuleWorkflow
 */
import {Injectable, Injector} from '@angular/core';
import {WorkflowTaskDefinitionI, WorkflowTaskTypeI} from "../interfaces/workflow.interfaces";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {Observable, Subject} from "rxjs";

/**
 * to share workflow manager task data with the components
 */
@Injectable()
export class WorkflowManagerService {
    /**
     * holds the workflow tasks
     */
    public tasks: WorkflowTaskDefinitionI[] = [];
    /**
     * holds the workflow task types
     */
    public types: WorkflowTaskTypeI[] = [];
    /**
     * holds the current module
     */
    public currentModule: { name: string, workflowDefinitions: any[], fields: { name: string, label: string }[] };

    constructor(private model: model, private modal: modal, private injector: Injector) {
    }

    /**
     * @return WorkflowTaskDefinitionI[] the workflow tasks which are not deleted from model data
     */
    get filteredTasks(): WorkflowTaskDefinitionI[] {
        return this.model.data.tasks.filter(t => t.deleted != 1);
    }

    /**
     * get model tasks
     * @return any[] tasks in model data
     */
    get modelTasks(): WorkflowTaskDefinitionI[] {
        return this.model.getField('tasks');
    }

    /**
     * get task data
     * @return WorkflowTaskDefinitionI
     * @param id
     */
    public getTaskObject(id): WorkflowTaskDefinitionI {
        return this.tasks.find(t => t.id == id);
    }

    /**
     * get type data
     * @return WorkflowTaskTypeI
     * @param id
     */
    public getType(id): WorkflowTaskTypeI {
        return this.types.find(t => t.id == id);
    }

    /**
     * get start type data
     * @return WorkflowTaskTypeI
     */
    public getStartType(): WorkflowTaskTypeI {
        return this.types.find(t => t.type == 'start');
    }

    /**
     * true if each task is followed by an end task
     * @return boolean
     */
    public hasAllEndTasks(): boolean {
        return !this.filteredTasks.some(t =>
            (!Array.isArray(t.type_config.next_tasks) || t.type_config.next_tasks.length == 0) && this.getType(t.tasktype).type != 'end'
        );
    }

    /**
     * true if the workflow has a start task
     * @return boolean
     */
    public hasStartTask(): boolean {
        return !!this.filteredTasks.find(t => !!t.tasktype && this.getStartType()?.id == t.tasktype);
    }

    /**
     * get end type data
     * @return WorkflowTaskTypeI
     */
    public getEndTask(): WorkflowTaskTypeI {
        return this.types.find(t => t.type == 'end');
    }

    /**
     * prompt task type and return an observable of the response
     * @param filterTypes
     */
    public promptTaskType(filterTypes?): Observable<any> {

        const resSubject = new Subject();

        this.modal.openModal('WorkflowManagerTaskTypesModal', true, this.injector).subscribe(modalRef => {

            if (!!filterTypes) {
                modalRef.instance.filterTypes = filterTypes;
            }

            modalRef.instance.selectedItem = (!filterTypes ? this.types : this.types.filter(t => filterTypes.indexOf(t.type) > -1))[0];

            modalRef.instance.response.subscribe((type: WorkflowTaskTypeI) => {
                resSubject.next(type);
                resSubject.complete();
            });

        });

        return resSubject.asObservable();
    }

    /**
     * generate a new task
     * @param typeId
     */
    public generateNewTask(typeId: string): WorkflowTaskDefinitionI {

        return {
            id: this.model.generateGuid(),
            workflowdefinition_id: this.model.id,
            deleted: 0,
            sequence: this.getNextSequence(),
            name: 'new Task ' + (this.modelTasks.length + 1),
            tasktype: typeId,
            type_config: {}
        };
    }

    /**
     * helper function that loops over the tasks and gets the next available sequence number in an incremtne of 10
     */
    public getNextSequence(): number {
        let highestSequence = 0;
        for (let task of this.modelTasks) {
            if (task.deleted != 1 && task.sequence > highestSequence) {
                highestSequence = task.sequence;
            }
        }

        return highestSequence + (10 - highestSequence % 10);
    }

    /**
     * sorts the tasks by the sequence
     */
    public sortTasksBySequence() {
        if (this.modelTasks) {
            this.modelTasks.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
            this.tasks.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
        }
    }

    /**
     * open edit modal
     * @param taskId
     */
    public openEditModal(taskId) {
        this.modal.openModal('WorkflowManagerTaskEditModal', true, this.injector).subscribe(ref => {
            ref.instance.task = this.filteredTasks.find(t => t.id == taskId);
            ref.instance.response.subscribe(taskData => {
                this.tasks = [...this.tasks.filter(t => t.id != taskData.id), taskData];
            });
        });
    }

    /**
     * get task next tasks
     * @param task
     */
    public getTaskNextTasks(task): { id: string, name: string }[] {

        if (!task.type_config) return [];

        const isDecision = this.getType(task.tasktype).type == 'gateway_decision';
        return (isDecision ? task.type_config.decisions :
            task.type_config.next_tasks.map(e => ({id: e, name: this.tasks.find(t => t.id == e).name}))) ?? [];
    }

    /**
     * get task next tasks
     * @param task
     * @param nextTask
     */
    public appendTaskNextTask(task: WorkflowTaskDefinitionI, nextTask: WorkflowTaskDefinitionI) {

        if (!task.type_config) return [];

        const isDecision = this.getType(task.tasktype).type == 'gateway_decision';
        const key = isDecision ? 'decisions' : 'next_tasks';

        if (!Array.isArray(task.type_config[key])) {
            task.type_config[key] = [];
        }

        if (isDecision) {
            task.type_config.decisions = [
                ...(task.type_config.decisions ?? []),
                {id: nextTask.id, name: nextTask.name}
            ];
        } else {
            task.type_config.next_tasks = [
                ...(task.type_config.next_tasks ?? []),
                nextTask.id
            ];
        }
    }

    /**
     * delete a next task from a task
     * @param task
     * @param idToDelete
     */
    public deleteTaskNextTask(task: WorkflowTaskDefinitionI, idToDelete: string) {

        if (!task.type_config) return;

        const isDecision = this.getType(task.tasktype).type == 'gateway_decision';

        if (isDecision) {
            task.type_config.decisions = task.type_config.decisions.filter(d => d.id != idToDelete);
        } else {
            task.type_config.next_tasks = task.type_config.next_tasks.filter(id => id != idToDelete);
        }
    }
}
