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
    selector: '[workflow-manager-detail-conditions-line]',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailconditionsline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailConditionsLine {

    @Input() condition: any = {};
    @Input() conditions: any = {};
    @Input() module: string = '';

    constructor(private metadata: metadata,
                private model: model,
                private view: view,
                private language: language,
                private modelutilities: modelutilities,
                private footer: footer) {
        this.model.module = 'WorkflowConditions';

        // set the view to edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        this.view.displayLabels = false;
    }

    ngOnChanges() {
        this.model.id = this.condition.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.condition);
    }

    /**
     * Todo: Update Logic
     * Removes Condition
     */
    removeCondition() {
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = 'Delete Condition';
            componenRef.instance.message = 'are you sure you want to delete the condition?';
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    let index = 0;
                    this.conditions.some(condition => {
                        if (condition.id == this.model.id) {
                            condition.deleted = 1;
                            return true;
                        }
                        index++;
                    })
                    // this.conditions.splice(index, 1);
                }
            });
        });
    }

}
