import {Component, ComponentRef} from '@angular/core';
import {Subject} from "rxjs";
import {ModalComponentI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";

/**
 * modal to edit workflow task conditions
 */
@Component({
    selector: 'workflow-manager-conditional-decision-task-conditions-modal',
    templateUrl: '../templates/workflowmanagerconditionaldecisiontaskconditionsmodal.html'
})

export class WorkflowManagerConditionalDecisionTaskConditionsModal implements ModalComponentI {
    /**
     * module to load the condition fields
     */
    public module: string;
    /**
     * check method namespace field
     */
    public method: string;
    /**
     * check method params string field
     */
    public methodParams: string;
    /**
     * conditions array
     */
    public conditions: any[] = [];
    /**
     * rxjs subject to emit the save click
     */
    public onSave = new Subject<void>();
    /**
     * reference of this modal
     */
    public self: ComponentRef<WorkflowManagerConditionalDecisionTaskConditionsModal>;

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * emit the save click and close the modal
     */
    public confirm() {
        this.onSave.next();
        this.onSave.complete();
        this.close();
    }
}