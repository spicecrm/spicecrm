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
import {Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";

/* @ignore */
declare var moment: any;
/* @ignore */
declare var _: any;

@Component({
    selector: 'sales-planning-tool-content',
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolcontent.html',
    providers: [view]
})

export class SalesPlanningToolContent implements OnChanges, OnDestroy {

    public data: any;
    public rowsSum: any;
    public dataBackup: any = {};
    public periods: any[] = [];
    public subscriptions: Subscription = new Subscription();
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
                private broadcast: broadcast,
                private view: view,
                private toast: toast,
                private modal: modal,
                private metadata: metadata,
                private userPrefs: userpreferences,
                private injector: Injector,
                private mathExpCompiler: MathExpressionCompilerService,
                private planningService: SalesPlanningService) {
    }

    get nodeName() {
        return this.planningService.selectedNodes.map(node => node.name).join('/');
    }

    get canEdit() {
        return this.metadata.checkModuleAcl(this.model.module, 'edit');
    }

    get modelOptions(): any {
        return {updateOn: 'blur'};
    }

    get isEditMode() {
        return this.view.isEditMode();
    }

    get contentFields() {
        return this.planningService.contentFields;
    }

    get markDone() {
        return this.nodeInfo && this.nodeInfo.marked_done;
    }

    set markDone(bool) {
        if (!this.nodeInfo.leaf || !this.canEdit || !this.isEditMode) return;
        this.isClosing = true;
        let action = !bool ? 'unmarkDone' : 'markDone';
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/${action}`)
            .subscribe(result => {
                if (result.success == true) {
                    this.nodeInfo.marked_done = bool;
                    this.isClosing = false;
                }
            });
    }

    public ngOnChanges() {
        this.setViewMode();
        this.buildPeriods();
        this.getNodeInfo();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
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
            this.periods.sort();
        }
    }

    private getNodeInfo() {
        if (!this.node) return;
        this.isLoading = true;
        this.nodeInfo = undefined;
        let params = {
            pathArray: this.planningService.selectedNodesIds,
            characteristics: this.planningService.selectedNode.level > 1 ? this.planningService.selectedCharacteristicIds : [this.planningService.characteristicTerritory],
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
        this.data = undefined;
        this.rowsSum = undefined;
        if (!this.node) return;
        let params = {
            pathArray: this.planningService.selectedNodesIds,
            characteristics: this.planningService.selectedCharacteristicIds,
        };
        this.backend.getRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/Content`, params)
            .subscribe(nodeContent => {
                if (nodeContent && nodeContent.data) {
                    this.data = this.formatAllData(nodeContent.data);
                    this.doRowsColumnsSum();
                }
                this.isLoading = false;
            });
    }

    private doRowsColumnsSum() {
        this.setColumnsSum();
        this.setRowsSum();
    }

    private setColumnsSum() {
        this.periods.forEach(period => {
            this.contentFields.forEach(field => {
                if ((field.group_action && field.group_action.length > 0) && (field.storable && field.storable == '1') ||
                    (field.cbfunction && field.cbfunction.length > 0) || (!field.formula && field.formula.length == 0)) return;

                this.data[field.id][period.key] = this.getCellValue(this.data[field.id], field.formula, period.key);

            });
        });
    }

    private setRowsSum() {
        this.rowsSum = {};
        let fieldsHasNoFormula = this.contentFields.filter(field => (!field.formula_sum || field.formula_sum.length == 0) && (!field.cbfunction_sum || field.cbfunction_sum.length == 0));
        let fieldsHasFormula = this.contentFields.filter(field => (field.formula_sum && field.formula_sum.length > 0) && (!field.cbfunction_sum || field.cbfunction_sum.length == 0));
        fieldsHasNoFormula.forEach(field => {
            this.rowsSum[field.id] = 0;
            this.periods.forEach(period => this.rowsSum[field.id] += +(this.machineFormat(this.data[field.id][period.key])));
        });
        fieldsHasFormula.forEach(field => this.rowsSum[field.id] = this.getRowSum(field.formula_sum));
    }

    private getCellValue(fieldData, formula, periodKey) {
        let result = fieldData[periodKey];
        let formulaIds = formula.match(/\[.*?]/g);
        let formulaValues = this.replaceIdsWithValues('contentData', formulaIds, formula, periodKey);
        let isValidFormula = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (isValidFormula) result = this.mathExpCompiler.do(formulaValues);
        return this.formatValue(result);
    }

    private getRowSum(formulaSum) {
        let result = 0;
        let formulaIds = formulaSum.match(/\[.*?]/g);
        let formulaValues = this.replaceIdsWithValues('rowSum', formulaIds, formulaSum);
        let isValidFormula = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (isValidFormula) result = +this.mathExpCompiler.do(formulaValues);
        return result;
    }

    private replaceIdsWithValues(source, ids, formula, periodKey?) {
        let parsedFormula = formula;
        ids.forEach(fieldId => {
            let idString = fieldId.replace(/[\[\]]/g, '');
            switch (source) {
                case 'contentData':
                    if (this.data[idString] && this.data[idString][periodKey]) {
                        let fieldValue = this.machineFormat(this.data[idString][periodKey]);
                        parsedFormula = parsedFormula.replace(fieldId, fieldValue);
                    }
                    break;
                case 'rowSum':
                    if (this.rowsSum[idString]) {
                        parsedFormula = parsedFormula.replace(fieldId, this.rowsSum[idString]);
                    }
                    break;
            }
        });
        return parsedFormula;
    }

    private formatAllData(data) {
        for (let id in data) {
            if (data.hasOwnProperty(id)) {
                this.periods.forEach(period => data[id][period.key] = this.formatValue(data[id][period.key]));
            }
        }
        return data;
    }

    private machineFormatAllData(data) {
        for (let id in data) {
            if (data.hasOwnProperty(id)) {
                this.periods.forEach(period => data[id][period.key] = this.machineFormat(data[id][period.key]));
            }
        }
        return data;
    }

    private setEditMode() {
        if (!this.nodeInfo.leaf || !this.canEdit) return;
        let dataPeriods = {};
        for (let key in this.data) if (this.data.hasOwnProperty(key)) dataPeriods[key] = {...this.data[key]};
        this.dataBackup = _.clone(dataPeriods);
        this.view.setEditMode();
    }

    private setViewMode() {
        this.dataBackup = undefined;
        this.view.setViewMode();
    }

    private save() {
        this.isSaving = true;
        let body = {data: this.machineFormatAllData(this.data)};
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.nodeInfo.planningNode}/Update`, {}, body)
            .subscribe(result => {
                if (result.success == true) {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    this.isSaving = false;
                    this.setViewMode();
                }
            });
    }

    private openInputHelper() {
        this.modal.openModal('SalesPlanningToolInputHelperModal', true, this.injector)
            .subscribe(ref => {
               ref.instance.periods = this.periods;
               ref.instance.allFields = this.contentFields;
               ref.instance.response.subscribe(res => this.executeInputHelperData(res));
            });
    }

    private executeInputHelperData(res) {
        if (!res) return;
        let periodRange = this.periods.slice(res.startPeriod, +res.endPeriod +1);
        let value = this.machineFormat(res.value);
        periodRange.forEach(period => {
            if (res.fromField == 'fixed') {
                this.data[res.toField][period.key] = res.evenly ? this.formatValue(+value / periodRange.length) : this.formatValue(value);
            } else {
                this.data[res.toField][period.key] = +this.machineFormat(this.data[res.fromField][period.key]);
                if (res.percentValue && res.percentValue.length > 0) {
                    this.data[res.toField][period.key] += +this.machineFormat(res.percentValue) * 100 / this.data[res.toField][period.key];
                }
                this.data[res.toField][period.key] = this.formatValue(this.data[res.toField][period.key]);
            }
        });
        this.doRowsColumnsSum();
    }

    private cancel() {
        this.data = _.clone(this.dataBackup);
        this.setViewMode();
    }

    private trackByItemFn(index, item) {
        return item.id;
    }

    private trackByIndexFn(index, item) {
        return index;
    }

    private getCellDisplayValue(column, contentField, withSymbol = true) {
        if (!this.data) return '';
        if (this.data[contentField.id][column] != '') {
            return (withSymbol ? this.getFieldSymbol(contentField.field_type) + ' ' : '') + this.data[contentField.id][column];
        } else {
            return '';
        }
    }

    private setCellValue(value, contentField, periodKey) {
        this.data[contentField.id][periodKey] = this.formatValue(value);
        this.doRowsColumnsSum();
    }

    private getRowSumDisplay(contentField) {
        if (!this.rowsSum && !this.data[contentField.id].sum) return '';
        let rowSum = this.data[contentField.id].sum || this.rowsSum[contentField.id];
        if (this.formatValue(rowSum) != '') {
            return `${this.getFieldSymbol(contentField.field_type)} ${this.formatValue(rowSum)}`;
        } else {
            return '';
        }
    }

    private formatValue(value) {
        return !isNaN(+value) && value != 0 ? this.userPrefs.formatMoney(+value) : '';
    }

    private machineFormat(value) {
        return ('' + value).replace(this.userPrefs.toUse.num_grp_sep, '').replace(this.userPrefs.toUse.dec_sep, '.');
    }

    private viewNote() {
        this.modal.openModal('SalesPlanningToolContentNoteModal')
            .subscribe(modalRef => {
                modalRef.instance.canEdit = this.canEdit;
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
            default:
                return '';
        }
    }

    private isDarkColor(color) {
        if (!color || color.length == 0) return false;
        let c = color.indexOf('#') > -1 ? color.substring(1) : color;
        let rgb = parseInt(c, 16);   // convert rrggbb to decimal
        // tslint:disable-next-line:no-bitwise
        let r = (rgb >> 16) & 0xff;  // extract red
        // tslint:disable-next-line:no-bitwise
        let g = (rgb >> 8) & 0xff;  // extract green
        // tslint:disable-next-line:no-bitwise
        let b = (rgb >> 0) & 0xff;  // extract blue
        let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        return luma < 120;
    }
}
