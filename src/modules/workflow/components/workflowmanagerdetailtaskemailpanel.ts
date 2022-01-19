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
    selector: 'workflow-manager-detail-task-emailpanel',
    templateUrl: '../templates/workflowmanagerdetailtaskemailpanel.html'
})
export class WorkflowManagerDetailTaskEmailpanel {

    public contentOption: string = 'email_template';
    constructor(public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {
        this.contentOption = this.model.getField('emailcontclass') && this.model.getField('emailcontclass').length > 0 ? 'method' : 'email_template';
    }
}
