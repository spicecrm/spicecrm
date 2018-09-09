import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {AppDataService} from "../../../services/appdata.service";


@Component({
    selector: 'workflow-manager-detail-task',
    templateUrl: './app/modules/workflow/templates/workflowmanagerdetailtask.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTask implements OnChanges{

    @Input() tasks: any = {};
    @Input() currenttask: string = '';
    @Input() module: string = '';
    activeTab: string = 'T';

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        this.model.module = 'WorkflowTaskDefinitions';
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnChanges() {
        this.tasks.some(task => {
            if(task.id == this.currenttask){
                this.model.id = task.id;
                this.model.data = this.modelutilities.backendModel2spice(this.model.module, task);
            }
        })


    }

}
