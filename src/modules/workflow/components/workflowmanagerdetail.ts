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


@Component({
    selector: 'workflow-manager-detail',
    templateUrl: '../templates/workflowmanagerdetail.html',
    providers: [model, view]
})
export class WorkflowManagerDetail implements OnChanges {

    @ViewChild('container', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;

    @Input() public modeldata: any = {};

    public activeTab: string = 'D';

    public fieldset: string = '';

    constructor(
        public backend: backend,
        public metadata: metadata,
        public model: model,
        public view: view,
        public language: language,
        public utils: modelutilities,
        public toast: toast
    ) {

        this.view.isEditable = true;
        this.view.setEditMode();

        let componentconfig = this.metadata.getComponentConfig('WorkflowManagerDetail', 'WorkflowDefinitions');
        if (componentconfig && componentconfig.fieldset) {
            this.fieldset = componentconfig.fieldset;
        }

        this.model.module = 'WorkflowDefinitions';
        this.model.initialize();
    }

    public ngOnChanges() {
        if (this.modeldata.id) {
            // this.model.module = this.module;
            this.model.id = this.modeldata.id;
            this.model.setData(this.modeldata);
            this.model.acl = {
                create: true,
                edit: true
            };
        }
    }

    get displayDetails() {
        return this.model.id ? true : false;
    }
}
