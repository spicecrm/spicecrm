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
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksystemactions.html',
})
export class WorkflowManagerDetailTaskSystemactions {

    @Input() private tasks: any = {};
    @Input() private module: string = '';

    constructor(private backend: backend, private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
    }

    private addAction() {
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
