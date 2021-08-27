/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input,
    Pipe
} from '@angular/core';
import {model} from '../../../services/model.service';

@Pipe({name: 'filteractual'})
export class filteractualpipe {

    constructor(private model: model) {

    }

    transform(value, field): string {
        return value;
    }
}

@Component({
    selector: 'workflow-manager-taskdropdown',
    templateUrl: './src/modules/workflow/templates/workflowmanagertaskdropdown.html'
})
export class WorkflowManagerTaskdropdown{

    @Input() tasks : any = {};
    @Input() field : string = '';
    @Input() disabled: boolean = false;

    constructor(private model: model) {

    }

    set value(value){
        this.model.data[this.field] = value;
    }

    get value(){
        return this.model.data[this.field];
    }


}
