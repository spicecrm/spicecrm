/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {navigationtab} from "../../services/navigationtab.service";
import {Router} from "@angular/router";

/**
 * open workflows in an new tab for a bean
 */
@Component({
    selector: 'object-workflow-button',
    templateUrl: '../templates/objectworkflowbutton.html'
})
export class ObjectWorkflowButton {
    /**
     * true if the workflow flag is active for the module in sysmodules
     */
    public useWorkflows: boolean = false;

    constructor(private metadata: metadata,
                private navigationTab: navigationtab,
                private router: Router,
                private model: model) {
        this.useWorkflows = this.metadata.getModuleDefs(this.model.module).workflow;
    }

    /**
     * open bean related workflows in a new tab
     */
    public open() {
        const routePrefix = this.navigationTab?.tabid ? '/tab/' + this.navigationTab.tabid : '';
        this.router.navigate([`${routePrefix}/module/${this.model.module}/${this.model.id}/workflows`]);
    }
}
