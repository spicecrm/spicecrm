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
    selector: 'workflow-manager-detail-task-systemactionspanel',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksystemactionspanel.html'
})
export class WorkflowManagerDetailTaskSystemactionspanel {
    @Input() module : string = '';

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {

    }


}
