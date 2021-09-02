/**
 * @module ModuleWorkflow
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'workflow-manager-task-types-standard',
    templateUrl: 'src/modules/workflow/templates/workflowmanagertasktypesstandard.html',
})

export class WorkflowManagerTaskTypesStandard {
    constructor(private model: model,
                private workflowManagerService: WorkflowManagerService,
                private metadata: metadata,
                private modal: modal,
                private language: language,
    ) {
    }


    get tasks() {
        return this.workflowManagerService.tasks;
    }

    public removeTask(id: string) {
        this.model.data.type_config.next_tasks = this.model.data.type_config.next_tasks.filter(task => task.id != id);
    }

    private addTask() {

        if (!this.model.data.type_config.decisions) {
            this.model.data.type_config.decisions = [];
        }

        this.model.data.type_config.decisions.push({
            id: this.model.generateGuid(),
            workflowtaskdefinition_id: this.model.id,
            deleted: 0,
            name: 'new Task',
            acl: {
                create: true,
                edit: true
            }
        });
    }
}
