/**
 * @module ModuleWorkflow
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: '[workflow-manager-detail-tasksystemactions-line]',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksystemactionsline.html'
})
export class WorkflowManagerDetailTaskSystemactionsLine {

    @Input() public systemaction: any = {};
    @Input() private field: string = '';
    @Output() private delete$ = new EventEmitter<void>();

    constructor(private modal: modal,
                private language: language,
                public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * remove the decision option from the available options
     * @private
     */

    public removeDecision() {
        this.modal.confirm('MSG_CONFIRM_KILL', this.language.getLabel('LBL_KILL')).subscribe(modalRef => {
            modalRef.instance.answer.subscribe(decision => {
                if (decision) {
                    this.delete$.emit();
                }
            });
        });
    }
}
