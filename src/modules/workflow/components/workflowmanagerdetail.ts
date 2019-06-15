/**
 * @module ModuleWorkflow
 */
import {
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
    selector: 'workflow-manager-detail',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetail.html',
    providers: [model, view]
})
export class WorkflowManagerDetail implements OnChanges {

    @ViewChild('container', {read: ViewContainerRef}) private container: ViewContainerRef;

    @Input() private modeldata: any = {};

    private activeTab: string = 'D';

    private fieldset: string = '';

    constructor(private appdata: AppDataService,
                private backend: backend,
                private metadata: metadata,
                private model: model,
                private view: view,
                private language: language,
                private utils: modelutilities,
                private toast: toast,) {

        this.view.isEditable = true;
        this.view.setEditMode();

        let componentconfig = this.metadata.getComponentConfig('WorkflowManagerDetail', 'WorkflowDefinitions');
        if (componentconfig && componentconfig.fieldset) {
            this.fieldset = componentconfig.fieldset;
        }

        this.model.module = 'WorkflowDefinitions';
    }

    public ngOnChanges() {
        if (this.modeldata.id) {
            // this.model.module = this.module;
            this.model.id = this.modeldata.id;
            this.model.data = this.modeldata;
        }
    }

    get displayDetails() {
        return this.model.id ? true : false;
    }
}
