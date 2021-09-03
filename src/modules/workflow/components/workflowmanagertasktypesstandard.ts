/**
 * @module ModuleWorkflow
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-task-types-standard',
    templateUrl: 'src/modules/workflow/templates/workflowmanagertasktypesstandard.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WorkflowManagerTaskTypesStandard implements OnInit {
    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService
    ) {
    }

    /**
     * initialize the next tasks array
     */
    public ngOnInit() {
        if (!Array.isArray(this.model.data.type_config.next_tasks)) {
            this.model.data.type_config.next_tasks = [];
        }
    }

    /**
     * @return any[] workflow tasks
     */
    public getOptions(): any[] {
        return this.workflowManagerService.tasks.filter(e => e.deleted != 1 && e.id != this.model.id && !this.model.data.type_config.next_tasks.some(nextTask => nextTask == e.id));
    }

    /**
     * remove the task from the next tasks array
     * @param id
     */
    public removeTask(id: string) {
        this.model.data.type_config.next_tasks = this.model.data.type_config.next_tasks.filter(task => task != id);
    }

    /**
     * add new task
     */
    public addTask() {
        this.model.data.type_config.next_tasks.push('');
    }

    /**
     * set the next task value
     * @param value
     * @param index
     */
    public setNextTaskValue(value: string, index: number) {
        this.model.data.type_config.next_tasks[index] = value;
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(item, index) {
        return item;
    }
}
