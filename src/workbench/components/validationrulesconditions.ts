/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'validationrules-conditions',
    templateUrl: './src/workbench/templates/validationrulesconditions.html',
})
export class ValidationRulesConditions implements OnInit {
    @Input() private data; // validation rule data
    private comparator_options: any[] = [];
    private fieldname_options: any[] = [];

    constructor(
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
    ) {

    }

    // @Inputs are only loaded here...???
    public ngOnInit() {
        // get options...
        this.comparator_options = this.language.getDisplayOptions('comparators_dom', true);

        for (let opt in this.metadata.getModuleFields(this.data.module)) {
            this.fieldname_options.push(opt);
            this.fieldname_options.sort();

        }
    }

    get conditions() {
        return this.data.conditions.filter((e) => {
            return e.deleted != 1;
        });
    }

    private addCondition() {
        return this.data.conditions.push({
            id: this.utils.generateGuid(),
            sysuimodelvalidation_id: this.data.id,
            isnewrecord: true,
        });
    }

    private removeCondition(id) {
        let idx = this.data.conditions.findIndex((e) => {
            return e.id == id
        });
        if (this.data.conditions[idx]._is_new_record) {
            this.data.conditions.splice(idx, 1);
        } else {
            this.data.conditions[idx].deleted = 1;
        }
        return true;
    }

}
