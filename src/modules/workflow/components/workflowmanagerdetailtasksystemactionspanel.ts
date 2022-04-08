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
    selector: 'workflow-manager-detail-task-systemactionspanel',
    templateUrl: '../templates/workflowmanagerdetailtasksystemactionspanel.html'
})
export class WorkflowManagerDetailTaskSystemactionspanel {
    @Input() public module: string = '';

    constructor(public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {

    }


}
