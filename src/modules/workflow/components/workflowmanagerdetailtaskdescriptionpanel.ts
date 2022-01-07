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
    templateUrl: '../templates/workflowmanagerdetailtaskdescriptionpanel.html'
})
export class WorkflowManagerDetailTaskDescriptionpanel {


    constructor(public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {

    }


}
