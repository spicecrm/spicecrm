/**
 * @module ModuleWorkflow
 */
import {
    Component
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';


@Component({
    selector: 'workflow-manager-detail-task-descriptionpanel',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtaskdescriptionpanel.html'
})
export class WorkflowManagerDetailTaskDescriptionpanel {


    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {

    }


}
