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
    ViewContainerRef
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';
import {toast} from '../../../services/toast.service';
import {configurationService} from "../../../services/configuration.service";
import {metadata} from "../../../services/metadata.service";


@Component({
    selector: 'workflow-panel-task',
    templateUrl: '../templates/workflowpaneltask.html'

})
export class WorkflowPanelTask implements OnChanges, AfterViewInit {
    /**
     * holds the task data
     */
    @Input() public workflowtask: any = {};

    /**
     * true if posting data to backend
     */
    public posting: boolean = false;
    /**
     * view container reference to the container element of the type component
     * @private
     */
    @ViewChild('typeComponentContainer', {read: ViewContainerRef}) public typeComponentContainer: ViewContainerRef;
    /**
     * holds the workflow data
     * @private
     */
    @Input() public workflow: any = {};
    /**
     * holds a reference of the task type component
     * @private
     */
    public typeComponentRef: ComponentRef<any>;

    constructor(public model: model,
                public workflowservice: workflow,
                public language: language, public broadcast: broadcast,
                public configurationService: configurationService,
                public toast: toast,
                public metadata: metadata,
                public injector: Injector,
                public modelutilities: modelutilities) {

    }

    /**
     * call to initialize the model
     * rerender the type component each time the onChanges triggered
     */
    public ngOnChanges() {
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
     */
    public renderTypeComponent() {

        if (!this.typeComponentContainer) return;

        this.destroyRenderedComponent();
        let component;

        const types = this.configurationService.getData('workflowtasktypes');

        if (types?.length > 0) {
            component = types?.find(type => type.id == this.workflowtask.tasktype)?.frontend_component;
        }

        if (!component) component = 'WorkflowPanelTaskStandard';

        this.metadata.addComponent(component, this.typeComponentContainer, this.injector).subscribe((componentRef: ComponentRef<any>) => {
            componentRef.instance.taskData = this.workflowtask;
            this.typeComponentRef = componentRef;
        });
    }

    /**
     * destroy the rendered type component
     * @private
     */
    public destroyRenderedComponent() {
        if (this.typeComponentRef) {
            this.typeComponentRef.destroy();
            this.typeComponentRef = undefined;
        }
    }
}
