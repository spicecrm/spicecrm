/**
 * @module ModuleWorkflow
 */
import {Component, Input, OnChanges} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-fieldsdropdown',
    templateUrl: './src/modules/workflow/templates/workflowmanagerfieldsdropdown.html'
})
export class WorkflowManagerFieldsdropdown implements OnChanges {

    public fields: any[] = [];
    @Input() private field: string = '';

    constructor(private model: model,
                private language: language,
                private metadata: metadata,
                private workflowManagerService: WorkflowManagerService) {

    }

    get value() {
        return this.model.data[this.field];
    }

    set value(value) {
        this.model.data[this.field] = value;
    }

    public ngOnChanges() {
        this.fields = [];
        let fields = this.metadata.getModuleFields(this.workflowManagerService.currentModule);
        for (let field in fields) {
            this.fields.push({
                name: fields[field].name,
                label: this.language.getFieldDisplayName(this.workflowManagerService.currentModule, fields[field].name)
            });
        }

        this.fields.sort((a, b) => {
            return a.label > b.label ? 1 : -1;
        });
    }
}
