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
    templateUrl: '../templates/workflowmanagerdetailtask.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTask implements OnChanges, AfterViewInit {

    public activeTab: string = 'T';
    /**
     * holds a reference to the type component to enable destroy on change
     * @public
     */
    public typeComponentRef: ComponentRef<any>;
    /**
     * holds the task data
     * @public
     */
    @Input() public task: any = {};
    /**
     * view container reference to the container element of the type component
     * @public
     */
    @ViewChild('typeComponentContainer', {read: ViewContainerRef}) public typeComponentContainer: ViewContainerRef;

    constructor(public metadata: metadata,
                public model: model,
                public view: view,
                public injector: Injector,
                public workflowManagerService: WorkflowManagerService,
                public modelutilities: modelutilities) {
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
     * @public
     */
    public renderTypeComponent() {

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
     * @public
     */
    public destroyRenderedComponent() {
        if (this.typeComponentRef) {
            this.typeComponentRef.destroy();
            this.typeComponentRef = undefined;
        }
    }

    /**
     * initialize the view service
     * @public
     */
    public initializeView() {
        this.view.isEditable = true;
        this.view.setEditMode();
        this.view.displayLabels = false;
    }

    /**
     * initialize the model data from the task
     * @public
     */
    public setModelData() {

        if (!this.task.type_config) {
            this.task.type_config = {};
        }
        this.model.id = this.task.id;
        this.task.acl = {
            create: true,
            edit: true,
            detail: true
        };

        this.model.setData(this.task, false);
    }
}
