/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';



@Component({
    selector: 'workflow-manager-detail-taskdecisions',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtaskdecisions.html',
})
export class WorkflowManagerDetailTaskDecisions{

    @Input() tasks : any = {};

    constructor( private backend: backend, private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        console.log(this.model.data.decisions);
    }

    addDecision(){
        this.model.data.decisions.push({
            id: this.modelutilities.generateGuid(),
            workflowtaskdefinition_id: this.model.id,
            deleted: 0,
            name: 'new Decision',
        });
    }
}
