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
    selector: '[workflow-manager-detail-tasksystemactions-line]',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksystemactionsline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTaskSystemactionsLine {

    @Input() systemaction: any = {};
    @Input() systemactions: any = {};
    @Input() module : string = '';

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities, private footer: footer) {
        this.model.module = 'WorkflowSystemActions';

        // set the view to edit mode
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnChanges() {
        this.model.id = this.systemaction.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.systemaction);
    }

    removeDecision(){
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = 'Delete Systemaction';
            componenRef.instance.message = 'are you sure you want to delete the system action?';
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    let index = 0;
                    this.systemactions.some(systemaction => {
                        if (systemaction.id == this.model.id) {
                            systemaction.deleted = 1;
                            return true;
                        }
                        index++;
                    })
                    // this.systemactions.splice(index, 1);
                }
            });
        });
    }

}
