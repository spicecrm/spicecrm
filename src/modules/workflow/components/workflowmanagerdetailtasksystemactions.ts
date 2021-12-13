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
    selector: 'workflow-manager-detail-tasksystemactions',
    templateUrl: '../templates/workflowmanagerdetailtasksystemactions.html',
})
export class WorkflowManagerDetailTaskSystemactions {

    @Input() public tasks: any = {};
    @Input() public module: string = '';

    constructor(public backend: backend, public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {
    }

    public addAction() {
        this.model.data.systemactions.push({
            id: this.modelutilities.generateGuid(),
            workflowtaskdefinition_id: this.model.id,
            deleted: 0,
            acl: {
                create: true,
                edit: true
            }
        });
    }
}
