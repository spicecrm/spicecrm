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
    selector: 'workflow-manager-detail-task-smspanel',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksmspanel.html'
})
export class WorkflowManagerDetailTaskSmspanel {

    private contentOption: string = 'email_template';
    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        this.contentOption = this.model.data.emailcontclass && this.model.data.emailcontclass.length > 0 ? 'method' : 'email_template';
    }
}
