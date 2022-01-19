/**
 * @module ModuleWorkflow
 */
import {Injectable, Injector} from '@angular/core';
import {WorkflowTaskTypeI} from "../interfaces/workflow.interfaces";
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
    public tasks: any[] = [];
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
     * @return any[] tasks in model data
     */
    get modelTasks() {
        return this.model.getField('tasks');
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

            modalRef.instance.response.subscribe((type: WorkflowTaskTypeI) => {
                resSubject.next(type);
                resSubject.complete();
            });

        });

        return resSubject.asObservable();
    }

    /**
     * generate a new task
     * @param type
     */
    public generateNewTask(type): any {

        return {
            id: this.model.generateGuid(),
            workflowdefinition_id: this.model.id,
            deleted: 0,
            sequence: this.getNextSequence(),
            name: 'new Task ' + (this.modelTasks.length + 1),
            tasktype: type.id,
            decisions: [],
            systemactions: [],
            closetask: false,
            primarytask: this.modelTasks.length == 0
        };
    }

    /**
     * helper function that loops over the tasks and gets the next available sequence number in an incremtne of 10
     */
    public getNextSequence(): number {
        let highestSequence = 0;

        for (let task of this.modelTasks) {
            if (task.deleted != 1 && parseInt(task.sequence, 10) > highestSequence) {
                highestSequence = parseInt(task.sequence, 10);
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
}
