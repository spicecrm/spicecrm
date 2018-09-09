import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    ViewChild,
    ViewContainerRef,
    Pipe
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

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
