/**
 * @module ModuleWorkflow
 */
import {
    Component, Injector, Input, OnInit
} from '@angular/core';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'workflow-panel-item',
    templateUrl: '../templates/workflowpanelitem.html',
})
export class WorkflowPanelItem {

    /**
     * the workflow
     */
    @Input() public workflow: any = {};

    /**
     * to display the panel collapsed
     */
    @Input() public collapsed: boolean = false;

    /**
     * indicates that we are loading the workflow
     */
    public loading: boolean = false;


    constructor(public backend: backend) {

    }

    /**
     * toggles the collpased vs not collapsed state
     */
    public toggleCollapsed() {
        this.collapsed = !this.collapsed;

        if(!this.collapsed && !this.workflow.workflowtasks){
            this.getWorkflowDetails();
        }
    }

    /**
     * loads the workflow details
     *
     * @private
     */
    private getWorkflowDetails(){
        this.loading = true;
        this.backend.getRequest(`module/Workflows/${this.workflow.id}/details`).subscribe({
            next: (res) => {
                this.workflow.workflowtasks = res.workflowtasks;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
            }
        })

    }

    /**
     * gets the proper toggle icon
     */
    get toggleicon() {
        return this.collapsed ? 'chevrondown' : 'chevronup';
    }

}
