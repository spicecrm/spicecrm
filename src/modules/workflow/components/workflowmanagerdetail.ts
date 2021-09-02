/**
 * @module ModuleWorkflow
 */
import {Component, Input, OnChanges} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';


@Component({
    selector: 'workflow-manager-detail',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetail.html',
    providers: [view]
})
export class WorkflowManagerDetail implements OnChanges {

    /**
     * model data passed from parent
     */
    @Input() public modelData: any = {};
    /**
     * holds the active tab
     */
    public activeTab: 'tasks' | 'conditions' | 'details' = 'details';
    /**
     * holds the fieldset id
     */
    public fieldset: string = '';

    constructor(
        private backend: backend,
        private metadata: metadata,
        private model: model,
        private view: view,
    ) {
        this.setEditMode();
        this.model.module = 'WorkflowDefinitions';
    }

    /**
     * set edit mode
     * set fieldset from component module config
     */
    public ngOnInit() {

        const config = this.metadata.getComponentConfig('WorkflowManagerDetail', 'WorkflowDefinitions');

        if (config?.fieldset) {
            this.fieldset = config.fieldset;
        }
    }

    /**
     * set model data
     */
    public ngOnChanges() {

        if (!this.modelData.id) return;

        this.model.id = this.modelData.id;
        this.model.initialize();
        this.model.setFields(
            this.model.utils.backendModel2spice('WorkflowDefinitions', this.modelData)
        );

        this.model.isNew = !!this.modelData.isNew;

        this.model.startEdit();
    }

    /**
     * set the edit mode in view
     * @private
     */
    private setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }
}
