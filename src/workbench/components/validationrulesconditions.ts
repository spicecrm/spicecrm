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
    templateUrl: '../templates/validationrulesconditions.html',
})
export class ValidationRulesConditions implements OnInit {
    @Input() public data; // validation rule data
    public comparator_options: any[] = [];
    public fieldname_options: any[] = [];

    constructor(
        public metadata: metadata,
        public language: language,
        public utils: modelutilities,
    ) {

    }

    // @Inputs are only loaded here...???
    public ngOnInit() {
        // get options...
        this.comparator_options = this.language.getDisplayOptions('comparators_dom', true);

        for (let opt in this.metadata.getModuleFields(this.data.module)) {
            this.fieldname_options.push(opt);
        }
        // sort field list by field name
        this.fieldname_options.sort();

        // sort the rows by fieldname on init only
        this.data.conditions.sort((a, b) => (a.fieldname ? a.fieldname.localeCompare(b.fieldname) : false));

    }

    get conditions() {
        return this.data.conditions.filter((e) => {
            return e.deleted != 1;
        });
    }

    public addCondition() {
        return this.data.conditions.push({
            id: this.utils.generateGuid(),
            sysuimodelvalidation_id: this.data.id,
            isnewrecord: true,
        });
    }

    public removeCondition(id) {
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
