/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {footer} from "../../../services/footer.service";


@Component({
    selector: '[workflow-manager-detail-tasks-line]',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTasksLine {

    @Input() task: any = {};
    @Input() tasks: any = {};
    @Input() fields: Array<any> = [];

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities, private footer: footer) {
        this.model.module = 'WorkflowTaskDefinitions';

        this.view.displayLabels = false;

    }

    ngOnChanges() {
        this.model.id = this.task.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.task);
    }

    getTaskName(taskID, renderMultiple = false) {
        let taskname = taskID;

        if (taskID) {
            this.tasks.some(task => {
                if (task.id == taskID) {
                    taskname = task.name;
                    return true;
                }
            })
        }

        // render the multiple next indicator
        if(renderMultiple && this.model.data.tasktype == 'decision' && this.model.data.decisions && this.model.data.decisions.length > 0){
            taskname = '[..]';
        }

        return taskname;
    }

    removeTask(){
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = 'Delete Task';
            componenRef.instance.message = 'are you sure you want to delete the task?';
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    let index = 0;
                    this.tasks.some(task => {
                        if (task.id == this.model.id) {
                            task.deleted = 1;
                            return true;
                        }
                        index++;
                    })
                    // this.tasks.splice(index, 1);
                }
            });
        });
    }
}
