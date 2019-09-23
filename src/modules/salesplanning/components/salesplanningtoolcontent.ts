/**
 * @module ModuleSalesPlanning
 */
import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {SalesPlanningService} from "../services/salesplanning.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {toast} from "../../../services/toast.service";
import {userpreferences} from "../../../services/userpreferences.service";

/**
 * @ignore
 */
declare var moment: any;
/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'sales-planning-tool-content',
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolcontent.html',
    providers: [view]
})

export class SalesPlanningToolContent implements OnChanges, OnDestroy {

    public nodeContentArray: any[] = [];
    public nodeContentArrayBackup: any[] = [];
    public periods: any[] = [];
    public languageSubscriber: any = {};
    public units: any = {
        days: 'd',
        weeks: 'w',
        months: 'M',
        quarters: 'Q',
        years: 'Y'
    };
    private planningNodeId: string;
    private nodeItemName: string = '';
    private isLoading: boolean = false;
    @Input() private node: any;

    constructor(private language: language,
                private backend: backend,
                private model: model,
                private view: view,
                private toast: toast,
                private metadata: metadata,
                private userPrefs: userpreferences,
                private planningService: SalesPlanningService) {
        this.subscribeToLanguage();
    }

    get modelOptions(): any {
        return {updateOn: 'blur'};
    }

    get isEditMode() {
        return this.view.isEditMode();
    }

    public ngOnChanges() {
        this.setViewMode();
        this.buildPeriods();
        this.getNodeItemName();
    }

    public ngOnDestroy() {
        this.languageSubscriber.unsubscribe();
    }

    private isEditable(fieldId) {
        let fieldClassifications = this.planningService.contentClassifications[fieldId];
        return fieldClassifications && fieldClassifications.editable && fieldClassifications.editable == 1;
    }

    private subscribeToLanguage() {
        this.languageSubscriber = this.language.currentlanguage$.subscribe(() => this.buildPeriods());
    }

    private buildPeriods() {

        this.periods = [];
        let unit = this.model.getField('periode_unit');
        let segments = this.model.getField('periode_segments');
        let dateStart = this.model.getField('date_start');

        if (segments && !isNaN(segments) && unit && this.units[unit]) {
            let formats: any = {
                days: 'E',
                weeks: 'dddd',
                months: 'MMMM',
                quarters: 'Q',
                years: 'YYYY'
            };
            let lang = this.language.currentlanguage.substring(0, 2);
            moment.locale(lang);
            let date = new moment(dateStart);
            let i = 0;
            while (i < +segments) {
                this.periods.push({
                    key: `data_${unit}_p${i + 1}`,
                    name: date.format(formats[unit])
                });
                date.add(1, this.units[unit]);
                i++;
            }
        }
    }

    private getNodeItemName() {
        this.nodeItemName = '';
        this.planningNodeId = undefined;
        if (!this.node) return;
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/NodeInfo`, params)
            .subscribe(nodeInfo => {
                if (nodeInfo && nodeInfo.planningNode) {
                    this.nodeItemName = nodeInfo.nodeText;
                    this.planningNodeId = nodeInfo.planningNode;
                    this.getNodeContent();
                }
            });
    }

    private getNodeContent() {
        this.nodeContentArray = [];
        if (!this.node) return;
        this.isLoading = true;
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.planningNodeId}/Content`, params)
            .subscribe(nodeContent => {
                if (nodeContent && nodeContent.data && nodeContent.data.length) {
                    this.nodeContentArray = nodeContent.data;
                    this.isLoading = false;
                }
            });
    }

    private setEditMode() {
        this.nodeContentArrayBackup = [];
        this.nodeContentArray.forEach(field => this.nodeContentArrayBackup.push(_.clone(field)));
        this.view.setEditMode();
    }

    private setViewMode() {
        this.view.setViewMode();
    }

    private save() {
        let body = {data: this.nodeContentArray};
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.planningNodeId}/Update`, {}, body)
            .subscribe(result => {
                if (result.success == true) {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    this.setViewMode();
                }
            });
    }

    private cancel() {
        this.nodeContentArray = [];
        this.nodeContentArray = this.nodeContentArrayBackup;
        this.setViewMode();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private setPeriodValues(value, field, periodKey) {
        field[periodKey] = value;
        this.nodeContentArray = this.nodeContentArray.map(field => {
            field[periodKey] = this.getFieldValue(field, periodKey);
            return field;
        });
    }

    private getFieldSum(field) {
        let result = 0;
        this.periods.forEach(period => result += +field[period.key]);
        let fieldClassifications = this.planningService.contentClassifications[field.field_id];
        if (!fieldClassifications.formula_sum || fieldClassifications.formula_sum.length == 0) {
            return this.formattedValue(result);
        }

        let ids = fieldClassifications.formula_sum.match(/\[.*?]/g);
        let formulaSum = fieldClassifications.formula_sum;
        let formulaValues = this.replaceIdsWithValues(ids, formulaSum, field.field_id, false, true);
        let canExecute = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (canExecute) result = this.evaluateFormula(formulaValues);
        return this.formattedValue(result);
    }

    private getFieldValue(field, periodKey) {
        let result = field[periodKey];
        let fieldClassifications = this.planningService.contentClassifications[field.field_id];
        if (!fieldClassifications.formula || fieldClassifications.formula.length == 0) return result;

        let ids = fieldClassifications.formula.match(/\[.*?]/g);
        let formula = fieldClassifications.formula;
        let formulaValues = this.replaceIdsWithValues(ids, formula, field.field_id, periodKey);
        let canExecute = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (canExecute) result = this.evaluateFormula(formulaValues);
        return result;
    }

    private replaceIdsWithValues(ids, formula, fieldId, periodKey?, isSumFormula = false) {
        ids.forEach(id => {
            let idField = this.nodeContentArray.find(contentField => contentField.field_id == id.replace(/[\[\]]/g, ''));
            if (idField && periodKey && idField[periodKey]) {
                idField[periodKey] = idField[periodKey]
                    .replace(this.userPrefs.toUse.num_grp_sep, '')
                    .replace(this.userPrefs.toUse.dec_sep, '.');
                formula = formula.replace(id, idField[periodKey]);
            } else if (idField && isSumFormula && formula.indexOf(fieldId) == -1) {
                formula = formula.replace(id, this.getFieldSum(idField).toString()
                    .replace(this.userPrefs.toUse.num_grp_sep, '')
                    .replace(this.userPrefs.toUse.dec_sep, '.')
                );
            }
        });
        return formula;
    }

    private evaluateFormula(formulaValues) {
        let operatorCheck = item => item == '+' || item == '-' || item == '*' || item == '/' || item == '%';
        formulaValues = formulaValues.split(' ');
        let operators = formulaValues.filter(value => operatorCheck(value));
        let numbers = formulaValues.filter(value => !isNaN(value));
        return numbers.reduce((acc, curr) => {
            let operator = operators.shift();
            switch (operator) {
                case '+':
                    return +acc + +curr;
                case '-':
                    return +acc - +curr;
                case '*':
                    return +acc * +curr;
                case '/':
                    return +acc / +curr;
                case '%':
                    return +acc % +curr;
                default:
                    return +acc + +curr;
            }
        }) || 0;
    }

    private formattedValue(value) {
        return !isNaN(+value) && value != 0 ? this.userPrefs.formatMoney(+value) : '';
    }
}
