/**
 * @module ModuleWorkflow
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-task-types-email-handle',
    templateUrl: '../templates/workflowmanagertasktypesemailhandle.html',
})
/**
 * handle managing the workflow task email handle type
 */
export class WorkflowManagerTaskTypesEmailHandle implements OnInit {

    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService,
                private modal: modal) {

    }

    /**
     * initialize the event array
     */
    public ngOnInit() {
        if (!Array.isArray(this.model.data.type_config.next_tasks)) {
            this.model.data.type_config.next_tasks = [];
        }
    }

    /**
     * adds a new event
     */
    public addEvent() {

        const options = this.workflowManagerService.tasks
            .filter(e => e.id != this.model.id && !this.model.data.type_config.next_tasks.some(event => event == e.id))
            .map(e => ({value: e.id, display: e.name}));

        this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_ADD', 'shade', null, options, true)
            .subscribe(id => {
                if (!id) return;
                this.model.data.type_config.next_tasks.push({
                    id: id,
                    name: 'new event'
                });
            });
    }

    /**
     * remove the event from the type_config next_tasks array
     * @param id
     */
    public deleteEvent(id) {
        this.modal.confirm('MSG_DELETE_RECORD', 'LBL_DELETE').subscribe(answer => {
            if (!answer) return;
            this.model.data.type_config.next_tasks = this.model.data.type_config.next_tasks.filter(d => id != d.id);
        });
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    public trackByFn(item, index) {
        return item.id;
    }
}
