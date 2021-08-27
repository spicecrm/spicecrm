/**
 * @module ModuleWorkflow
 */
import {Component, Input, Pipe} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'workflow-manager-taskdropdown',
    templateUrl: './src/modules/workflow/templates/workflowmanagertaskdropdown.html'
})
export class WorkflowManagerTaskdropdown {

    @Input() public tasks: any[] = [];
    @Input() public field: string = '';
    @Input() public disabled: boolean = false;

    constructor(private model: model) {

    }

    get value() {
        return this.model.data[this.field];
    }

    set value(value) {
        this.model.data[this.field] = value;
    }
}
