/**
 * @module ModuleSalesPlanning
 */
import {Component, Injector, Input, OnChanges, OnDestroy} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {SalesPlanningService} from "../services/salesplanning.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {toast} from "../../../services/toast.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {MathExpressionCompilerService} from "../../../services/mathexpressioncompiler";
import {modal} from "../../../services/modal.service";

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
    public nodeInfo: any = {};
    private isLoading: boolean = false;
    private isClosing: boolean = false;
    @Input() private node: any;

    constructor(private language: language,
                private backend: backend,
                private model: model,
                private view: view,
                private toast: toast,
                private modal: modal,
                private metadata: metadata,
                private userPrefs: userpreferences,
                private injector: Injector,
                private mathExpCompiler: MathExpressionCompilerService,
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
        this.getNodeInfo();
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

    private getNodeInfo() {
        if (!this.node) return;
        this.isLoading = true;
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/NodeInfo`, params)
            .subscribe(nodeInfo => {
                if (nodeInfo && nodeInfo.planningNode) {
                    this.nodeInfo = nodeInfo;
                    this.getNodeContent();
                } else {
                    this.isLoading = false;
                }
            });
    }

    private getNodeContent() {
        this.nodeContentArray = [];
        if (!this.node) return;
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/Content`, params)
            .subscribe(nodeContent => {
                if (nodeContent && nodeContent.data && nodeContent.data.length) {
                    this.nodeContentArray = nodeContent.data;
                }
                this.isLoading = false;
            });
    }

    private setEditMode() {
        if (!this.nodeInfo.leaf) return;
        this.nodeContentArrayBackup = [];
        this.nodeContentArray.forEach(field => {
            this.nodeContentArrayBackup.push(_.clone(field));
            this.periods.forEach(period => {
                field[period.key] = this.formatValue(field[period.key]);
            });
        });
        this.view.setEditMode();
    }

    private setViewMode() {
        this.view.setViewMode();
    }

    private save() {
        let body = {data: this.nodeContentArray};
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/Update`, {}, body)
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

    private toggleMarkDone() {
        if (!this.nodeInfo.leaf) return;
        this.isClosing = true;
        let action = this.nodeInfo.marked_done ? 'unmarkDone' : 'markDone';
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/${action}`)
            .subscribe(result => {
                if (result.success == true) {
                    this.nodeInfo.marked_done = !this.nodeInfo.marked_done;
                    this.isClosing = false;
                    this.setViewMode();
                }
            });
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private setPeriodValues(value, inputField, periodKey) {
        inputField[periodKey] = this.formatValue(value);
        this.nodeContentArray = this.nodeContentArray.map(contentField => {
            if (inputField.field_id != contentField.field_id) {
                contentField[periodKey] = this.formatValue(this.getFieldValue(contentField, periodKey));
            }
            return contentField;
        });
    }

    private getFieldSum(field) {
        let result = 0;
        this.periods.forEach(period => result += +(this.machineFormatValue(field[period.key]))
        );
        let fieldClassifications = this.planningService.contentClassifications[field.field_id];
        if (!fieldClassifications.formula_sum || fieldClassifications.formula_sum.length == 0) {
            return result;
        }

        let ids = fieldClassifications.formula_sum.match(/\[.*?]/g);
        let formulaSum = fieldClassifications.formula_sum;
        let formulaValues = this.replaceIdsWithValues(ids, formulaSum, field.field_id, false, true);
        let canExecute = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (canExecute) result = +this.mathExpCompiler.do(formulaValues);
        return result;
    }

    private getFieldSumDisplay(field) {
        return this.formatValue(this.getFieldSum(field));
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
        if (canExecute) result = this.mathExpCompiler.do(formulaValues);
        return result;
    }

    private replaceIdsWithValues(ids, formula, fieldId, periodKey?, isSumFormula?) {
        ids.forEach(id => {
            let idField = this.nodeContentArray.find(contentField => contentField.field_id == id.replace(/[\[\]]/g, ''));
            if (idField && periodKey && idField[periodKey]) {
                idField[periodKey] = this.machineFormatValue(idField[periodKey]);
                formula = formula.replace(id, idField[periodKey]);
            } else if (idField && isSumFormula && formula.indexOf(fieldId) == -1) {
                formula = formula.replace(id, this.machineFormatValue(this.getFieldSum(idField)));
            }
        });
        return formula;
    }

    private formatValue(value) {
        return !isNaN(+value) && value != 0 ? this.userPrefs.formatMoney(+value) : '';
    }

    private machineFormatValue(value) {
        return (''+ value).replace(this.userPrefs.toUse.num_grp_sep, '').replace(this.userPrefs.toUse.dec_sep, '.');
    }

    private viewNote() {
        this.modal.openModal('SalesPlanningToolContentNoteModal')
            .subscribe(modalRef => {
                modalRef.instance.nodeInfo = this.nodeInfo;
                modalRef.instance.doSave.subscribe(() => this.saveContentNote());
            });
    }

    private saveContentNote() {
        let body = {notice: this.nodeInfo.notice};
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/setNotice`, {}, body)
            .subscribe(result => {
                if (result.success == true) {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    this.setViewMode();
                }
            });
    }
}
