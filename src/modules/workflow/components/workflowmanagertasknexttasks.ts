/**
 * @module ModuleWorkflow
 */
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'workflow-manager-task-next-tasks',
    templateUrl: '../templates/workflowmanagertasknexttasks.html'
})

export class WorkflowManagerTaskNextTasks implements OnInit {

    constructor(public model: model,
                private modal: modal,
                private cdRef: ChangeDetectorRef,
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
     * remove the task from the next tasks array
     * @param id
     */
    public removeTask(id: string) {
        this.model.data.type_config.next_tasks = this.model.data.type_config.next_tasks.filter(entry => entry.id != id);
    }

    /**
     * add new task
     */
    public addTask() {

        const options = this.workflowManagerService.tasks
            .filter(e => e.id != this.model.id && !this.model.data.type_config.next_tasks.some(entry => entry.id == e.id))
            .map(e => ({value: e.id, display: e.name}));

        this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_ADD', 'shade', null, options, true)
            .subscribe(id => {
                if (!id) return;
                this.model.data.type_config.next_tasks.push({id, name: this.workflowManagerService.tasks.find(t => t.id == id).name});
                this.cdRef.detectChanges();
            });
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
