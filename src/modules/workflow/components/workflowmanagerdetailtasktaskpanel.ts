/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'workflow-manager-detail-task-taskpanel',
    templateUrl: '../templates/workflowmanagerdetailtasktaskpanel.html'
})
export class WorkflowManagerDetailTaskTaskpanel {

    @Input() tasks : any = {};

    constructor(public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {

    }

    get nextTaskDisabled(){
        if(this.model.getField('tasktype') == 'decision') {
            return true;
        }

        if(this.model.getField('closetask')) {
            return true;
        }

        return false;
    }

    get previousTaskDisabled(){
        if(this.model.getField('primarytask')) {
            return true;
        }

        return false;
    }

}
