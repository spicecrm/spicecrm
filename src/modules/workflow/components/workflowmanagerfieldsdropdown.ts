/**
 * @module ModuleWorkflow
 */
import {Component, Input} from '@angular/core';
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-fieldsdropdown',
    templateUrl: '../templates/workflowmanagerfieldsdropdown.html'
})
export class WorkflowManagerFieldsdropdown {

    public fields: any[] = [];
    @Input() public field: string = '';

    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * fill the dropwdown menu with appropriate field value
     */

    get value() {
        return this.model.data[this.field];
    }

    set value(value) {
        this.model.data[this.field] = value;
    }
}
