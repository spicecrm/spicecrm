/**
 * @module ModuleWorkflow
 */
import {Injectable, Injector} from '@angular/core';
import {WorkflowTaskDefI, WorkflowTaskTypeI} from "../interfaces/workflow.interfaces";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {Observable, Subject} from "rxjs";

/**
 * to share workflow manager task data with the components
 */
@Injectable()
export class WorkflowManagerService {

    /**
     * if true display diagram
     */
    public displayDiagram: boolean = true;

    /**
     * holds the deleted workflow task types
     */
    public deletedTasks: WorkflowTaskTypeI[] = [];

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
     * set model tasks
     * @param tasks
     */
    set tasks(tasks: WorkflowTaskDefI[]) {
        this.model.setField('tasks', tasks);
    }

    /**
     * get model tasks
     * @return any[] tasks in model data
     */
    get tasks(): WorkflowTaskDefI[] {
        return this.model.getField('tasks');
    }

    /**
     * delete task
     * @param id
     */
    public deleteTask(id: string) {
        this.deletedTasks.push(
            this.model.data.tasks.find(t => t.id == id)
        );
        this.model.data.tasks = this.model.data.tasks.filter(t => t.id != id);
    }

    /**
     * get task data
     * @return WorkflowTaskDefI
     * @param id
     */
    public getTaskObject(id): WorkflowTaskDefI {
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
        return !this.tasks.some(t =>
            (!Array.isArray(t.type_config.next_tasks) || t.type_config.next_tasks.length == 0) && this.getType(t.tasktype).type != 'end'
        );
    }

    /**
     * true if the workflow has a start task
     * @return boolean
     */
    public hasStartTask(): boolean {
        return !!this.tasks.find(t => !!t.tasktype && this.getStartType()?.id == t.tasktype);
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
    public generateNewTask(typeId: string): WorkflowTaskDefI {
        // create a new task
        let newtask: WorkflowTaskDefI = {
            id: this.model.generateGuid(),
            workflowdefinition_id: this.model.id,
            deleted: 0,
            sequence: this.getNextSequence(),
            name: 'new Task ' + (this.tasks.length + 1),
            tasktype: typeId,
            type_config: {}
        };

        // check if we have type defaults
        let t = this.types.find(t => t.id == typeId);
        if(t.typedefaults){
            let defaults = JSON.parse(t.typedefaults);
            for(let v in defaults){
                newtask[v] = defaults[v];
            }
        }

        // return the new task
        return newtask;
    }

    /**
     * helper function that loops over the tasks and gets the next available sequence number in an incremtne of 10
     */
    public getNextSequence(): number {
        let highestSequence = 0;
        for (let task of this.tasks) {
            if (task.sequence > highestSequence) {
                highestSequence = task.sequence;
            }
        }

        return highestSequence + (10 - highestSequence % 10);
    }

    /**
     * sorts the tasks by the sequence
     */
    public sortTasksBySequence(tasks) {
        tasks.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    }

    /**
     * open edit modal
     * @param taskId
     */
    public openEditModal(taskId) {

        const resSubject = new Subject<void>();

        this.modal.openModal('WorkflowManagerTaskEditModal', true, this.injector).subscribe(ref => {
            ref.instance.task = this.tasks.find(t => t.id == taskId);
            ref.instance.response.subscribe(taskData => {
                resSubject.next();
                this.tasks = [...this.tasks.filter(t => t.id != taskData.id), taskData];
            });
        });

        return resSubject;
    }

    /**
     * get task next tasks
     * @param task
     */
    public getTaskNextTasks(task): { id: string, name: string }[] {

        if (!task.type_config) return [];

        return task.type_config.next_tasks ?? [];
    }

    /**
     * get task next tasks
     * @param task
     * @param nextTask
     */
    public appendTaskNextTask(task: WorkflowTaskDefI, nextTask: WorkflowTaskDefI) {

        if (!task.type_config) return [];

        if (!Array.isArray(task.type_config.next_tasks)) {
            task.type_config.next_tasks = [];
        }

        task.type_config.next_tasks = [
            ...task.type_config.next_tasks,
            {id: nextTask.id, name: nextTask.name, type: nextTask.tasktype}
        ];
    }

    /**
     * delete a next task from a task
     * @param task
     * @param idToDelete
     */
    public deleteTaskNextTask(task: WorkflowTaskDefI, idToDelete: string) {

        if (!task.type_config) return;

        task.type_config.next_tasks = task.type_config.next_tasks.filter(entry => entry.id != idToDelete);
    }

    /**
     * get task available next task types
     * @param task
     */
    public getTaskAvailableTypes(task: WorkflowTaskDefI): string[] {

        switch (this.getType(task.tasktype).type) {
            case 'end':
                return [];
            case 'gateway_email_event':
                return ['regular', 'gateway_email_event', 'gateway_decision', 'end', 'email_event_open', 'email_event_bounce', 'email_event_timer'];
            default:
                return ['regular', 'gateway_email_event', 'gateway_decision', 'end'];
        }
    }
}
