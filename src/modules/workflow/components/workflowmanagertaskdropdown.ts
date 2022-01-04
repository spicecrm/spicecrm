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

    constructor(public model: model) {

    }

    transform(value, field): string {
        return value;
    }
}

@Component({
    selector: 'workflow-manager-taskdropdown',
    templateUrl: '../templates/workflowmanagertaskdropdown.html'
})
export class WorkflowManagerTaskdropdown{

    @Input() tasks : any = {};
    @Input() field : string = '';
    @Input() disabled: boolean = false;

    constructor(public model: model) {

    }

    set value(value){
        this.model.setField(this.field, value);
    }

    get value(){
        return this.model.getField(this.field);
    }


}
