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
    templateUrl: '../templates/workflowmanagerdetailtaskdecisions.html',
})
export class WorkflowManagerDetailTaskDecisions {

    @Input() public tasks: any = {};

    constructor(public backend: backend, public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {

    }

    /**
     * adds a new decision
     */
    public addDecision() {
        this.model.data.decisions.push({
            id: this.modelutilities.generateGuid(),
            workflowtaskdefinition_id: this.model.id,
            deleted: 0,
            name: 'new Decision',
            acl: {
                create: true,
                edit: true
            }
        });
    }
}
