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
    templateUrl: '../templates/workflowmanagerdetailtasksystemactionsline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTaskSystemactionsLine {

    @Input() public systemaction: any = {};
    @Input() public systemactions: any = {};
    @Input() public module: string = '';

    constructor(public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities, public footer: footer) {
        this.model.module = 'WorkflowSystemActions';

        // set the view to edit mode
        this.view.isEditable = true;
        this.view.setEditMode();
        this.view.displayLabels = false;
    }

    public ngOnChanges() {
        this.model.id = this.systemaction.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.systemaction);
    }

    public removeDecision() {
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
                    });
                }
            });
        });
    }

}
