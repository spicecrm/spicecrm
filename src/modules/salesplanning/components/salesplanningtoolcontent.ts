/**
 * @module ModuleSalesPlanning
 */
import {Component, Injector, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
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

    public nodeContentData: any;
    public nodeContentDataBackup: any = {};
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
    private isSaving: boolean = false;
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

    get contentFields() {
        return _.toArray(this.planningService.contentFields);
    }

    get markDone() {
        return this.nodeInfo && this.nodeInfo.marked_done;
    }

    set markDone(bool) {
        if (!this.nodeInfo.leaf) return;
        this.isClosing = true;
        let action = bool ? 'unmarkDone' : 'markDone';
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/${action}`)
            .subscribe(result => {
                if (result.success == true) {
                    this.nodeInfo.marked_done = bool;
                    this.isClosing = false;
                    this.setViewMode();
                }
            });
    }

    public ngOnChanges() {
        this.setViewMode();
        this.buildPeriods();
        this.getNodeInfo();
    }

    public ngOnDestroy() {
        this.languageSubscriber.unsubscribe();
    }

    private subscribeToLanguage() {
        this.languageSubscriber = this.language.currentlanguage$.subscribe(() => this.buildPeriods());
    }

    private buildPeriods() {

        if (this.periods.length > 0 ) return;
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
        this.nodeInfo = undefined;
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
        this.nodeContentData = undefined;
        if (!this.node) return;
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/Content`, params)
            .subscribe(nodeContent => {
                if (nodeContent && nodeContent.data) {
                    this.nodeContentData = this.formatAllData(nodeContent.data);
                }
                this.isLoading = false;
            });
    }

    private formatAllData(data) {
        for (let id in data) {
            if (data.hasOwnProperty(id)) {
                this.periods.forEach(period => {
                    data[id][period.key] = this.formatValue(data[id][period.key]);
                });
            }
        }
        return data;
    }

    private setEditMode() {
        if (!this.nodeInfo.leaf) return;
        this.nodeContentDataBackup = _.clone(this.nodeContentData);
        this.view.setEditMode();
    }

    private setViewMode() {
        this.nodeContentDataBackup = undefined;
        this.view.setViewMode();
    }

    private save() {
        this.isSaving = true;
        let body = {data: this.nodeContentData};
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/Update`, {}, body)
            .subscribe(result => {
                if (result.success == true) {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    this.isSaving = false;
                    this.setViewMode();
                }
            });
    }

    private cancel() {
        this.nodeContentData = _.clone(this.nodeContentDataBackup);
        this.setViewMode();
    }

    private trackByItemFn(index, item) {
        return item.id;
    }

    private trackByIndexFn(index, item) {
        return index;
    }

    private getValue(column, contentField, withSymbol = true) {
        if (!this.nodeContentData) return '';
        if (this.nodeContentData[contentField.id][column] != '') {
            return (withSymbol ? this.getFieldSymbol(contentField.field_type) +' ' : '') + this.nodeContentData[contentField.id][column];
        } else {
            return '';
        }
    }

    private setPeriodValues(value, contentField, periodKey) {
        this.nodeContentData[contentField.id][periodKey] = this.formatValue(value);
        for (let itemId in this.nodeContentData) {
            if (this.nodeContentData.hasOwnProperty(itemId)) {
                if (this.nodeContentData[contentField.id].field_id != this.nodeContentData[itemId].field_id) {
                    this.nodeContentData[itemId][periodKey] = this.getFieldValue(this.nodeContentData[itemId], contentField, periodKey);
                }
            }
        }
    }

    private getFieldSum(fieldData, contentField) {
        let result = 0;
        this.periods.forEach(period => result += +(this.machineFormatValue(fieldData[period.key])));
        if (!contentField.formula_sum || contentField.formula_sum.length == 0) {
            return result;
        }

        let ids = contentField.formula_sum.match(/\[.*?]/g);
        let formulaSum = contentField.formula_sum;
        let formulaValues = this.replaceIdsWithValues(ids, formulaSum, fieldData, contentField, false, true);
        let canExecute = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (canExecute) result = +this.mathExpCompiler.do(formulaValues);
        return result;
    }

    private getFieldSumDisplay(contentField) {
        if (!this.nodeContentData) return '';
        if (this.formatValue(this.getFieldSum(this.nodeContentData[contentField.id], contentField)) != '') {
            return `${this.getFieldSymbol(contentField.field_type)} ${this.formatValue(this.getFieldSum(this.nodeContentData[contentField.id], contentField))}`;
        } else {
            return '';
        }
    }

    private getFieldValue(fieldData, contentField, periodKey) {
        let result = fieldData[periodKey];
        if (!contentField.formula || contentField.formula.length == 0) return result;

        let ids = contentField.formula.match(/\[.*?]/g);
        let formula = contentField.formula;
        let formulaValues = this.replaceIdsWithValues(ids, formula, fieldData, contentField, periodKey);
        let canExecute = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (canExecute) result = this.mathExpCompiler.do(formulaValues);
        return this.formatValue(result);
    }

    private replaceIdsWithValues(ids, formula, fieldData, contentField, periodKey?, isSumFormula?) {
        ids.forEach(id => {
            if (fieldData.field_id == id.replace(/[\[\]]/g, '') && periodKey && fieldData[periodKey]) {
                let value = this.machineFormatValue(fieldData[periodKey]);
                formula = formula.replace(id, value);
            } else if (fieldData.field_id == id.replace(/[\[\]]/g, '') && isSumFormula && formula.indexOf(fieldData.field_id) == -1) {
                formula = formula.replace(id, this.machineFormatValue(this.getFieldSum(fieldData, contentField)));
            }
        });
        return formula;
    }

    private formatValue(value) {
        return !isNaN(+value) && value != 0 ? this.userPrefs.formatMoney(+value) : '';
    }

    private machineFormatValue(value) {
        return ('' + value).replace(this.userPrefs.toUse.num_grp_sep, '').replace(this.userPrefs.toUse.dec_sep, '.');
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

    private getFieldSymbol(fieldType) {
        switch (fieldType) {
            case 'currency':
                return '€';
            case 'percentage':
                return '%';
        }
    }
}
