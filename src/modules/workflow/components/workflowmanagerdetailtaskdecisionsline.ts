/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {footer} from "../../../services/footer.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";


@Component({
    selector: '[workflow-manager-detail-taskdecisions-line]',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtaskdecisionsline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTaskDecisionsLine {

    @Input() private decision: any = {};
    @Input() private decisions: any = {};

    constructor(private workflowManagerService: WorkflowManagerService, private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities, private footer: footer) {
        this.model.module = 'WorkflowTaskDecisions';

        // set the view to edit mode
        this.view.isEditable = true;
        this.view.displayLabels = false;
        this.view.setEditMode();
    }

    /**
     * @return any[] array of the workflow tasks
     */
    get tasks() {
        return this.workflowManagerService.tasks;
    }

    public ngOnChanges() {
        this.model.id = this.decision.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.decision);
    }

    private removeDecision() {
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = 'Delete Decision';
            componenRef.instance.message = 'are you sure you want to delete the decision option?';
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    let index = 0;
                    this.decisions.some(decision => {
                        if (decision.id == this.model.id) {
                            decision.deleted = 1;
                            return true;
                        }
                        index++;
                    });
                    // this.decisions.splice(index, 1);
                }
            });
        });
    }

}
