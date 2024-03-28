import {Component, OnInit} from '@angular/core';
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

/**
 * Workflow manager component to add conditional next tasks
 */
@Component({
    selector: 'workflow-manager-task-types-conditional-decision',
    templateUrl: '../templates/workflowmanagertasktypesconditionaldecision.html'
})

export class WorkflowManagerTaskTypesConditionalDecision implements OnInit {
    constructor(public model: model,
                public modal: modal,
                public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * initialize the decision array
     */
    public ngOnInit() {
        if (!Array.isArray(this.model.data.type_config.next_tasks)) {
            this.model.data.type_config.next_tasks = [];
        }
    }

    /**
     * adds a new decision
     */
    public addDecision() {

        const options = this.workflowManagerService.tasks
            .filter(e => e.id != this.model.id && !this.model.data.type_config.next_tasks.some(decision => decision == e.id))
            .map(e => ({value: e.id, display: e.name}));

        this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_ADD', 'shade', null, options, true)
            .subscribe(id => {
                if (!id) return;

                this.workflowManagerService.appendTaskNextTask(
                    this.model.data, this.workflowManagerService.getTaskObject(id)
                );

                this.workflowManagerService.openConditionsModal(
                    this.model.data.type_config.next_tasks.find(t => t.id == id)
                );
            });
    }

    /**
     * remove the decision from the type_config decisions array
     * @param id
     */
    public deleteDecision(id: string) {
        this.modal.confirm('MSG_DELETE_RECORD', 'LBL_DELETE').subscribe(answer => {
            if (!answer) return;
            this.model.data.type_config.next_tasks = this.model.data.type_config.next_tasks.filter(d => id != d.id);
        });
    }

    /**
     * open conditions modal to edit the conditions
     * @param id
     */
    public openConditionsModal(id: string) {
        const decision = this.model.data.type_config.next_tasks.find(t => t.id == id);

        this.workflowManagerService.openConditionsModal(decision);
    }

    /**
     * rearrange the tasks by sequence
     * @param event
     */
    public onDrop(event: CdkDragDrop<any>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.model.data.type_config.next_tasks = event.container.data.map((decision, index) => {
            decision.sequence = (index + 1) * 10;
            return decision;
        });
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    public trackByFn(item, index): string {
        return item.id;
    }
}