/**
 * @module ModuleReports
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {reporterconfig} from "../services/reporterconfig";

@Component({
    selector: 'reporter-filter-item-reference',
    templateUrl: './src/modules/reports/templates/reporterfilteritemreference.html'
})
export class ReporterFilterItemReference implements OnInit {
    /**
     * whereCondition: object
     */
    @Input() private whereCondition: any = {};

    private fieldName: string;

    constructor(private language: language,
                private reporterConfig: reporterconfig,
                private model: model) {
    }

    set referenceField(value: string) {
        this.whereCondition.value = value;
        this.whereCondition.valuekey = value;
    }

    get referenceField(): string {
        return this.whereCondition.value;
    }

    get referenceFields() {
        const whereConditions = this.model.getField('whereconditions');
        const operatorType = this.reporterConfig.operatorAssignments[this.whereCondition.overrideType || this.whereCondition.type] || 'varchar';
        return whereConditions.filter(condition => !!condition.reference && (this.reporterConfig.operatorAssignments[condition.type] || 'varchar') == operatorType && this.whereCondition.fieldid != condition.fieldid);
    }

    /**
     * set the fieldName from path and load the referenceFields
     */
    public ngOnInit() {
        const pathArray = this.whereCondition.path.split('::');

        // the last entry has to be the field
        let fieldArray = pathArray[pathArray.length - 1].split(':');
        this.fieldName = fieldArray[1];
    }
}
