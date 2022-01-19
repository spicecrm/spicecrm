/**
 * @module ModuleWorkflow
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-task-types-decision',
    templateUrl: '../templates/workflowmanagertasktypesdecision.html',
})
/**
 * handle managing the workflow task decision type
 */
export class WorkflowManagerTaskTypesDecision implements OnInit {

    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService,
                private modal: modal) {

    }

    /**
     * initialize the decision array
     */
    public ngOnInit() {
        if (!Array.isArray(this.model.data.type_config.decisions)) {
            this.model.data.type_config.decisions = [];
        }
    }

    /**
     * adds a new decision
     */
    public addDecision() {

        const options = this.workflowManagerService.tasks
            .filter(e => e.deleted != 1 && e.id != this.model.id && !this.model.data.type_config.decisions.some(decision => decision == e.id))
            .map(e => ({value: e.id, display: e.name}));

        this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_ADD', 'shade', null, options, true)
            .subscribe(id => {
                if (!id) return;
                this.model.data.type_config.decisions.push({
                    id: id,
                    name: 'new Decision'
                });
            });
    }

    /**
     * remove the decision from the type_config decisions array
     * @param id
     */
    public deleteDecision(id) {
        this.modal.confirm('MSG_DELETE_RECORD', 'LBL_DELETE').subscribe(answer => {
            if (!answer) return;
            this.model.data.type_config.decisions = this.model.data.type_config.decisions.filter(d => id != d.id);
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
