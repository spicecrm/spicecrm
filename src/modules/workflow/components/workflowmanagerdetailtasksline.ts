/**
 * @module ModuleWorkflow
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {footer} from "../../../services/footer.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";


@Component({
    selector: 'workflow-manager-detail-tasks-line',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTasksLine {

    @Input() public task: any = {};
    @Input() public fields: any[] = [];
    @Output() public deleted$ = new EventEmitter<void>();

    constructor(public workflowManagerService: WorkflowManagerService, private metadata: metadata, public model: model, private view: view, private language: language, private modelutilities: modelutilities, private footer: footer) {
        this.model.module = 'WorkflowTaskDefinitions';

        this.view.displayLabels = false;

    }

    public ngOnChanges() {
        this.model.id = this.task.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.task);
    }

    /**
     * assign a name to every task
     * @param taskID
     */
    public getTaskName(taskID) {
        let taskname = taskID;

        if (taskID) {
            this.workflowManagerService.tasks.some(task => {
                if (task.id == taskID) {
                    taskname = task.name;
                    return true;
                }
            });
        }

        return taskname;
    }

    /**
     * Deletes the task
     */
    public removeTask() {
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = 'Delete Task';
            componenRef.instance.message = 'are you sure you want to delete the task?';
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    this.task.deleted = 1;
                    this.deleted$.next();
                }
            });
        });
    }
}
