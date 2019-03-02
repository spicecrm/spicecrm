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
    selector: 'workflow-manager-detail-conditions',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailconditions.html',
    providers: [view]
})
export class WorkflowManagerDetailConditions {

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    addCondition(){
        let newGuid = this.modelutilities.generateGuid();
        this.model.data.conditions.push({
            id: newGuid,
            workflowdefinition_id: this.model.id,
            deleted: 0,
        });

    }


}
