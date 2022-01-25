/**
 * @module ModuleWorkflow
 */
import {Component, OnInit} from "@angular/core";
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";

/**
 * modal to edit workflow data
 */
@Component({
    selector: 'workflow-manager-edit-modal',
    templateUrl: '../templates/workflowmanagereditmodal.html',
    providers: [view]
})

export class WorkflowManagerEditModal implements OnInit {
    /**
     * reference of this component
     */
    public self: any = {};
    /**
     * holds the details fieldset id
     */
    public fieldset: string;

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
        this.model.startEdit(true, true);
        this.self.destroy();
    }

    /**
     * emit the selected item
     */
    public confirm() {
        this.self.destroy();
    }

    /**
     * initialize the model and start editing
     * @private
     */
    private initialize() {

        if (this.model.isNew) {
            this.model.initialize();
        } else {
            this.model.setFields(
                this.model.utils.backendModel2spice('WorkflowDefinitions', this.model.data)
            );
        }

        this.model.startEdit();
        this.view.isEditable = true;
        this.view.setEditMode();

        const config = this.metadata.getComponentConfig('WorkflowManagerDetail', 'WorkflowDefinitions');

        if (config?.fieldset) {
            this.fieldset = config.fieldset;
        }
    }
}

