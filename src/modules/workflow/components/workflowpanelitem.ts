/**
 * @module ModuleWorkflow
 */
import {
    Component, Input, OnInit
} from '@angular/core';

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
     * toggles the collpased vs not collapsed state
     */
    public toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }

    /**
     * gets the proper toggle icon
     */
    get toggleicon() {
        return this.collapsed ? 'chevrondown' : 'chevronup';
    }

}
