/**
 * @module ModuleWorkflow
 */
import {Component, OnInit} from "@angular/core";
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {Subject} from "rxjs";

/**
 * modal to edit workflow data
 */
@Component({
    selector: 'workflow-manager-edit-modal',
    templateUrl: '../templates/workflowmanagereditmodal.html',
    providers: [view, model]
})

export class WorkflowManagerEditModal implements OnInit {
    /**
     * response observable
     */
    public response: Subject<any> = new Subject<any>();
    /**
     * reference of this component
     */
    public self: any = {};
    /**
     * holds the details fieldset id
     */
    public fieldset: string;
    /**
     * holds the details fieldset id
     */
    public workflowData: any;

    constructor(private workflowManagerService: WorkflowManagerService,
                private metadata: metadata,
                private view: view,
                private model: model) {
    }

    /**
     * call initialize
     */
    public ngOnInit() {
        this.initialize();
    }

    /**
     * close the modal
     */
    public cancel() {
        this.model.cancelEdit();
        this.response.next(undefined);
        this.self.destroy();
    }

    /**
     * emit the selected item
     */
    public confirm() {
        this.model.endEdit();
        this.response.next(this.model.data);
        this.self.destroy();
    }

    /**
     * initialize the model and start editing
     * @private
     */
    private initialize() {

        this.model.module = 'WorkflowDefinitions';
        this.model.id = this.workflowData.id;
        this.model.initialize();
        this.model.setFields(
            this.model.utils.backendModel2spice('WorkflowDefinitions', this.workflowData)
        );

        this.model.startEdit();
        this.view.isEditable = true;
        this.view.setEditMode();

        const config = this.metadata.getComponentConfig('WorkflowManagerDetail', 'WorkflowDefinitions');

        if (config?.fieldset) {
            this.fieldset = config.fieldset;
        }
    }
}

