/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input,
    OnChanges,
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';


@Component({
    selector: 'workflow-manager-detail-task',
    templateUrl: '../templates/workflowmanagerdetailtask.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTask implements OnChanges {

    @Input() public tasks: any = {};
    @Input() public currenttask: string = '';
    @Input() public module: string = '';
    public activeTab: string = 'T';

    constructor(public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {
        this.model.module = 'WorkflowTaskDefinitions';
        this.view.isEditable = true;
        this.view.setEditMode();

        this.view.displayLabels = false;
    }

    public ngOnChanges() {
        this.tasks.some(task => {
            if (task.id == this.currenttask) {
                this.model.id = task.id;
                this.model.setData(task);
                this.model.acl = {
                    create: true,
                    edit: true
                };
                this.model.initializeFieldsStati();
            }
        });


    }

}
