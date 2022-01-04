/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input,
    OnChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'workflow-manager-fieldsdropdown',
    templateUrl: '../templates/workflowmanagerfieldsdropdown.html'
})
export class WorkflowManagerFieldsdropdown implements OnChanges {

    @Input() field: string = '';
    @Input() module: string = '';
    fields: Array<any> = [];

    constructor(public model: model, public language: language, public metadata: metadata) {

    }

    ngOnChanges() {
        this.fields = [];
        let fields = this.metadata.getModuleFields(this.module);
        for (let field in fields) {
            this.fields.push({name: fields[field].name, label: this.language.getFieldDisplayName(this.module, fields[field].name)});
        }

        this.fields.sort((a, b) => {
            return a.label > b.label ? 1 : -1;
        })
    }

    set value(value) {
        this.model.setField(this.field, value);
    }

    get value() {
        return this.model.getField(this.field);
    }
}
