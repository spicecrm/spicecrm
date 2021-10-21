/**
 * @module ModuleWorkflow
 */
import {Component, Input} from '@angular/core';
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-fieldsdropdown',
    templateUrl: './src/modules/workflow/templates/workflowmanagerfieldsdropdown.html'
})
export class WorkflowManagerFieldsdropdown {

    public fields: any[] = [];
    @Input() private field: string = '';

    constructor(private model: model,
                public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * fill the dropwdown menu with appropriate field value
     * @private
     */

    get value() {
        return this.model.data[this.field];
    }

    set value(value) {
        this.model.data[this.field] = value;
    }
}
