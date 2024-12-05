/**
 * @module ModuleWorkflow
 */
import {AfterViewInit,
    Component,
    ComponentRef,
    Injector,
    Input,
    OnChanges,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';
import {toast} from '../../../services/toast.service';
import {configurationService} from "../../../services/configuration.service";
import {metadata} from "../../../services/metadata.service";
import moment from "moment";


@Component({
    selector: 'workflow-panel-task',
    templateUrl: '../templates/workflowpaneltask.html'
})
export class WorkflowPanelTask implements OnChanges, AfterViewInit, OnInit {
    /**
     * holds the task data
     */
    @Input() public workflowtask: any = {};

    /**
     * holds value of workflowtask's field date_due
     */
    public dateDue;

    /**
     * true if posting data to backend
     */
    public posting: boolean = false;

    /**
     * stores the workflowtask types available
     */
    public taskTypes: any = [];

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

    constructor(public workflowservice: workflow,
                public language: language, public broadcast: broadcast,
                public configurationService: configurationService,
                public toast: toast,
                public metadata: metadata,
                public injector: Injector,
                public modelutilities: modelutilities) {

    }

    public ngOnInit() {
        // retrieve date_due on load
        this.dateDue = this.workflowtask.date_due;
        // retrieve the workflowtask types
        this.taskTypes = this.configurationService.getData('workflowtasktypes');

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
     * returns a badge class
     */
    get badgeClass(){
        let dueDate = moment(this.workflowtask.date_due);
        if(dueDate.isAfter(moment(), 'day')) return 'slds-theme_success';
        if(dueDate.isSame(moment(), 'day')) return 'slds-theme_warning';
        if(dueDate.isBefore(moment(), 'day')) return 'slds-theme_error';
    }

    /**
     * render the workflow task type component
     */
    public renderTypeComponent() {

        if (!this.typeComponentContainer) return;

        this.destroyRenderedComponent();
        let component;

        if (this.taskTypes?.length > 0) {
            component = this.taskTypes?.find(type => type.id == this.workflowtask.tasktype)?.frontend_component;
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
