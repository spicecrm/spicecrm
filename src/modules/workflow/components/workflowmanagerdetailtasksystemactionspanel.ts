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
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksystemactionspanel.html'
})
export class WorkflowManagerDetailTaskSystemactionspanel {
    @Input() public module: string = '';

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {

    }


}
