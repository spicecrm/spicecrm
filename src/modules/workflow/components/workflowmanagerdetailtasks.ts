/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input,
    OnChanges
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {AppDataService} from "../../../services/appdata.service";


@Component({
    selector: 'workflow-manager-detail-tasks',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasks.html',
})
export class WorkflowManagerDetailTasks implements OnChanges {

    @Input() tasks: Array<any> = [];
    fields: Array<any> = [];
    selectedTask: string = '';

    constructor(private appdata: AppDataService, private backend: backend, private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        /*
        let componentconfig = this.metadata.getComponentConfig('WorkflowManagerDetailTasks', 'WorkflowTaskDefinitions');
        if (componentconfig && componentconfig.fieldset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        }
        */
    }

    ngOnChanges() {
        this.sortTasksBySequence();

        // select the first task
        if(this.tasks.length > 0)
            this.selectedTask = this.tasks[0].id;
        else
            this.selectedTask = '';

    }

    sortTasksBySequence() {
        if (this.tasks)
            this.tasks.sort((a, b) => {
                return a.sequence > b.sequence ? 1 : -1;
            })
    }

    addTask(){
        let newGuid = this.modelutilities.generateGuid();
        this.tasks.push({
            id: newGuid,
            workflowdefinition_id: this.model.id,
            deleted: 0,
            sequence: this.getNextSequence(),
            name: 'new Task',
            tasktype: 'task',
            decisions: [],
            systemactions: [],
            primarytask: this.tasks.length == 0 ? true : false
        });
        this.selectedTask = newGuid;
    }

    getNextSequence(){
        let highestSequence = 0;

        for(let task of this.tasks){
            if(task.deleted != 1 && parseInt(task.sequence) > highestSequence){
                highestSequence = parseInt(task.sequence);
            }
        }

        return highestSequence + ( 10 - highestSequence % 10);
    }

}
