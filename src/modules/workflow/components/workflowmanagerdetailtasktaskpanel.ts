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
    selector: 'workflow-manager-detail-task-taskpanel',
    templateUrl: './app/modules/workflow/templates/workflowmanagerdetailtasktaskpanel.html'
})
export class WorkflowManagerDetailTaskTaskpanel {

    @Input() tasks : any = {};

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {

    }

    get nextTaskDisabled(){
        if(this.model.data && this.model.data.tasktype == 'decision')
            return true;

        if(this.model.data && this.model.data.closetask)
            return true;

        return false;
    }

    get previousTaskDisabled(){
        if(this.model.data && this.model.data.primarytask)
            return true;

        return false;
    }

}
