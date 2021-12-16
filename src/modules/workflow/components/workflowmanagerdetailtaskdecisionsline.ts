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


@Component({
    selector: '[workflow-manager-detail-taskdecisions-line]',
    templateUrl: '../templates/workflowmanagerdetailtaskdecisionsline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTaskDecisionsLine {

    @Input() public decision: any = {};
    @Input() public decisions: any = {};
    @Input() public tasks: any[] = [];

    constructor(public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities, public footer: footer) {
        this.model.module = 'WorkflowTaskDecisions';

        // set the view to edit mode
        this.view.isEditable = true;
        this.view.displayLabels = false;
        this.view.setEditMode();
    }

    public ngOnChanges() {
        this.model.id = this.decision.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.decision);
    }

    public removeDecision() {
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
