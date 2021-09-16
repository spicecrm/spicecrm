/**
 * @module ModuleWorkflow
 */
import {
    AfterViewInit,
    Component,
    ComponentRef,
    Injector,
    Input,
    OnChanges,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";


@Component({
    selector: 'workflow-manager-detail-task',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtask.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTask implements OnChanges, AfterViewInit {

    public activeTab: string = 'T';
    /**
     * holds a reference to the type component to enable destroy on change
     * @private
     */
    private typeComponentRef: ComponentRef<any>;
    /**
     * holds the task data
     * @private
     */
    @Input() private task: any = {};
    /**
     * view container reference to the container element of the type component
     * @private
     */
    @ViewChild('typeComponentContainer', {read: ViewContainerRef}) private typeComponentContainer: ViewContainerRef;

    constructor(private metadata: metadata,
                private model: model,
                private view: view,
                private injector: Injector,
                private workflowManagerService: WorkflowManagerService,
                private modelutilities: modelutilities) {
        this.model.module = 'WorkflowTaskDefinitions';
        this.model.startEdit();
        this.initializeView();
    }

    /**
     * call to initialize the model
     * rerender the type component each time the onChanges triggered
     */
    public ngOnChanges() {
        this.setModelData();
        this.renderTypeComponent();
    }

    /**
     * render the type component for the first time after onChanges triggered
     */
    public ngAfterViewInit() {
        this.renderTypeComponent();
    }

    /**
     * render the workflow task type component
     * @private
     */
    private renderTypeComponent() {

        if (!this.typeComponentContainer) return;

        this.destroyRenderedComponent();

        let component = this.workflowManagerService.types.find(type => type.id == this.task.tasktype)?.admin_component;

        if (!component) component = 'WorkflowManagerTaskTypesStandard';

        this.metadata.addComponent(component, this.typeComponentContainer, this.injector).subscribe(componentRef => {
            this.typeComponentRef = componentRef;
        });
    }

    /**
     * destroy the rendered type component
     * @private
     */
    private destroyRenderedComponent() {
        if (this.typeComponentRef) {
            this.typeComponentRef.destroy();
            this.typeComponentRef = undefined;
        }
    }

    /**
     * initialize the view service
     * @private
     */
    private initializeView() {
        this.view.isEditable = true;
        this.view.setEditMode();
        this.view.displayLabels = false;
    }

    /**
     * initialize the model data from the task
     * @private
     */
    private setModelData() {

        if (!this.task.type_config) {
            this.task.type_config = {};
        }
        this.model.id = this.task.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.task);
        this.model.data.acl = {
            create: true,
            edit: true,
            detail: true
        };
    }
}
