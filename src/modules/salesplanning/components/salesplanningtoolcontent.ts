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
    templateUrl: '../templates/salesplanningtoolcontent.html',
    providers: [view]
})

export class SalesPlanningToolContent implements OnChanges, OnDestroy {

    public data: any;
    public rowsSum: any;
    public dataBackup: any = {};
    public rowsSumBackup: any = {};
    public periods: any[] = [];
    public subscriptions: Subscription = new Subscription();
    public units: any = {
        days: 'd',
        weeks: 'w',
        months: 'M',
        quarters: 'Q',
        years: 'Y'
    };

    /**
     * the info retrieved on the node from the backend call
     */
    public nodeInfo: any = {};

    /**
     * an aray with the node crumbs as retriveed with the call from the backend
     */
    public nodeCrumbs: any[] = [];

    public isLoading: boolean = false;
    public isSaving: boolean = false;
    public isClosing: boolean = false;
    @Input() public node: any;

    constructor(public language: language,
                public backend: backend,
                public model: model,
                public broadcast: broadcast,
                public view: view,
                public toast: toast,
                public modal: modal,
                public metadata: metadata,
                public userPrefs: userpreferences,
                public injector: Injector,
                public mathExpCompiler: MathExpressionCompilerService,
                public planningService: SalesPlanningService) {
    }

    get displayNodeCrumbs() {
        return this.nodeCrumbs.length > 0 ? this.nodeCrumbs : this.planningService.selectedNodes.map(node => {
            return {displayname: node.name};
        });
    }

    get canEdit() {
        return this.model.getField('status') == 'a';
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
        if (bool) {
            this.backend.postRequest(`module/SalesPlanningContents/${this.planningService.versionId}/${this.nodeInfo.planningNode}/done`)
                .subscribe(result => {
                    if (result.success == true) {
                        this.nodeInfo.marked_done = bool;
                        this.isClosing = false;
                    }
                });
        } else {
            this.backend.deleteRequest(`module/SalesPlanningContents/${this.planningService.versionId}/${this.nodeInfo.planningNode}/done`)
                .subscribe(result => {
                    if (result.success == true) {
                        this.nodeInfo.marked_done = bool;
                        this.isClosing = false;
                    }
                });
        }
    }

    public ngOnChanges() {
        this.setViewMode();
        this.buildPeriods();
        this.getNodeInfo();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @reset periods
    * @push period: {key: string, name:string}
    * @sort periods by default
    */
    public buildPeriods() {
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

    /*
    * @reset nodeInfo
    * @get nodeInfo
    * @get nodeContent
    */
    public getNodeInfo() {
        if (!this.node) return;
        this.isLoading = true;
        this.nodeInfo = undefined;
        this.nodeCrumbs = [];
        let params = {
            pathArray: this.planningService.selectedNodesIds,
            characteristics: this.planningService.selectedNode.level > 1 ? this.planningService.selectedCharacteristicIds : [this.planningService.characteristicTerritory],
        };
        this.backend.getRequest(`module/SalesPlanningNodes/${this.planningService.versionId}/nodeinfo`, params)
            .subscribe(nodeInfo => {
                if (nodeInfo && nodeInfo.planningNode) {
                    this.nodeInfo = nodeInfo;
                    this.nodeCrumbs = nodeInfo.nodecrumbs;
                    this.getNodeContent();
                } else {
                    this.isLoading = false;
                }
            });
    }

    /*
    * @reset data
    * @reset rowsSum
    * @set data
    * @sum rows and columns
    */
    public getNodeContent() {
        this.data = undefined;
        this.rowsSum = undefined;
        if (!this.node) return;
        let params = {
            pathArray: this.planningService.selectedNodesIds,
            characteristics: this.planningService.selectedCharacteristicIds,
        };
        this.backend.getRequest(`module/SalesPlanningContents/${this.planningService.versionId}/${this.nodeInfo.planningNode}`, params)
            .subscribe(nodeContent => {
                if (nodeContent && nodeContent.data) {
                    this.data = this.formatAllData(nodeContent.data);
                    this.doRowsColumnsSum();
                }
                this.isLoading = false;
            });
    }

    /*
    * @calculate columnFields
    * @calculate rowsTotals
    */
    public doRowsColumnsSum() {
        this.calculateColumnFields();
        this.calculateRowsTotals();
    }

    /*
    * @calculate cellValue if formula is set
    */
    public calculateColumnFields() {
        this.periods.forEach(period => {
            this.contentFields.forEach(field => {
                // return if we do not have a formula
                if (!field.formula || field.formula.length == 0) return;

                // do not execute on editbale fields on a leaf
                if (this.nodeInfo.leaf && field.editable) return;

                // do not calculate on fields that have a callback function if we are not on a leaf
                if (!this.nodeInfo.leaf && field.cbfunction) return;

                this.data[field.id][period.key] = this.getCellValue(this.data[field.id], field.formula, period.key);

            });
        });
    }

    /*
    * @sum field columns if formula_sum is not set and cbfunction_sum is not set
    * @calculate field columns if formula_sum is set and cbfunction_sum is not set
    */
    public calculateRowsTotals() {
        this.rowsSum = {};
        let fieldsHasNoFormula = this.contentFields.filter(field => (!field.formula_sum || field.formula_sum.length == 0) && (!field.cbfunction_sum || field.cbfunction_sum.length == 0));
        let fieldsHasFormula = this.contentFields.filter(field => (field.formula_sum && field.formula_sum.length > 0) && (!field.cbfunction_sum || field.cbfunction_sum.length == 0));
        fieldsHasNoFormula.forEach(field => {
            this.rowsSum[field.id] = 0;
            this.periods.forEach(period => this.rowsSum[field.id] += +(this.machineFormat(this.data[field.id][period.key])));
        });
        fieldsHasFormula.forEach(field => this.rowsSum[field.id] = this.getRowSum(field.formula_sum));
    }

    /*
    * @param fieldData: any
    * @param formula: string
    * @param periodKey: string
    * @get formulaValues
    * @check isValidFormula
    * @calculate formulaValues by mathExpCompiler.do
    * @return result: formatted number
    */
    public getCellValue(fieldData, formula, periodKey) {
        let result = fieldData[periodKey];
        let formulaIds = formula.match(/\[.*?]/g);
        let formulaValues = this.replaceIdsWithValues('contentData', formulaIds, formula, periodKey);
        let isValidFormula = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (isValidFormula) result = this.mathExpCompiler.do(formulaValues);
        return this.formatValue(result);
    }

    /*
    * @param formulaSum: string
    * @get formulaValues
    * @check isValidFormula
    * @calculate formulaValues by mathExpCompiler.do
    * @return result: number
    */
    public getRowSum(formulaSum) {
        let result = 0;
        let formulaIds = formulaSum.match(/\[.*?]/g);
        let formulaValues = this.replaceIdsWithValues('rowSum', formulaIds, formulaSum);
        let isValidFormula = !!formulaValues
            .match(/^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/%])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g);
        if (isValidFormula) result = +this.mathExpCompiler.do(formulaValues);
        return result;
    }

    /*
    * @param source: 'contentData' | 'rowSum'
    * @param ids: string[]
    * @param formula: string
    * @param periodKey?: string
    * @replace fieldId with cellValue
    * @return parsedFormula
    */
    public replaceIdsWithValues(source, ids, formula, periodKey?) {
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

    /*
    * @param data: any
    * @format cellValue
    * @return data: any
    */
    public formatAllData(data) {
        for (let id in data) {
            if (data.hasOwnProperty(id)) {
                this.periods.forEach(period => data[id][period.key] = this.formatValue(data[id][period.key]));
            }
        }
        return data;
    }

    /*
    * @param data: any
    * @machineFormat cellValue
    * @return data: any
    */
    public machineFormatAllData(data) {
        for (let id in data) {
            if (data.hasOwnProperty(id)) {
                this.periods.forEach(period => data[id][period.key] = this.machineFormat(data[id][period.key]));
            }
        }
        return data;
    }

    /*
    * @clone dataPeriods
    * @backup data
    * @backup rowsSum
    * @set editMode true
    * @set isEditing true
    */
    public setEditMode() {
        if (!this.nodeInfo.leaf || !this.canEdit) return;
        let dataPeriods = {};
        for (let key in this.data) if (this.data.hasOwnProperty(key)) dataPeriods[key] = {...this.data[key]};
        this.dataBackup = _.clone(dataPeriods);
        this.rowsSumBackup = _.clone(this.rowsSum);
        this.view.setEditMode();
        this.planningService.isEditing = true;
    }

    /*
    * @reset dataBackup
    * @reset rowsSumBackup
    * @set viewMode true
    * @set isEditing false
    */
    public setViewMode() {
        this.dataBackup = undefined;
        this.rowsSumBackup = undefined;
        this.view.setViewMode();
        this.planningService.isEditing = false;
    }

    /*
    * @save data
    * @toast success
    * @set viewMode true
    * @set data
    */
    public save() {
        this.isSaving = true;
        let body = {data: this.machineFormatAllData(this.data)};
        this.backend.postRequest(`module/SalesPlanningContents/${this.planningService.versionId}/${this.nodeInfo.planningNode}`, {}, body)
            .subscribe(result => {
                if (result.success == true) {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    this.isSaving = false;
                    this.setViewMode();
                }
            });

        this.data = this.formatAllData(this.data);
    }

    /*
    * @openModal SalesPlanningToolInputHelperModal
    * @pass contentFields
    * @pass periods
    * @execute inputHelperData
    */
    public openInputHelper() {
        this.modal.openModal('SalesPlanningToolInputHelperModal', true, this.injector)
            .subscribe(ref => {
                ref.instance.periods = this.periods;
                ref.instance.allFields = this.contentFields;
                ref.instance.response.subscribe(res => this.executeInputHelperData(res));
            });
    }

    /*
    * if fromField equals 'fixed' and evenly is true, set the cellValues evenly from the @param res.value
    * if fromField is another field, set the cellValue from the other field and add the percentage value
    * if the percentValue is set.
    * @param res: {
    *       startPeriod: string, endPeriod: string, value: string, evenly: boolean,
    *       fromField: string, toField: string, percentValue: number
    * }
    * @get periodRange
    * @set cellValue
    * @do rowsColumnsSum
    */
    public executeInputHelperData(res) {
        if (!res) return;
        let periodRange = this.periods.slice(res.startPeriod, +res.endPeriod + 1);
        let value = this.machineFormat(res.value);
        periodRange.forEach(period => {
            if (res.fromField == 'fixed') {
                this.data[res.toField][period.key] = res.evenly ? this.formatValue(+value / periodRange.length) : this.formatValue(value);
            } else {
                this.data[res.toField][period.key] = +this.machineFormat(this.data[res.fromField][period.key]);
                if (res.percentValue && res.percentValue.length > 0) {
                    let newValue = this.data[res.toField][period.key];
                    this.data[res.toField][period.key] = this.mathExpCompiler
                        .do(`${newValue} + ${res.percentValue} * 100 / ${newValue}`);
                }
                this.data[res.toField][period.key] = this.formatValue(this.data[res.toField][period.key]);
            }
        });
        this.doRowsColumnsSum();
    }

    /*
    * @restore data
    * @restore rowsSum
    * @set viewMode true
    */
    public cancel() {
        this.data = _.clone(this.dataBackup);
        this.rowsSum = _.clone(this.rowsSumBackup);
        this.setViewMode();
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return item
    */
    public trackByItemFn(index, item) {
        return item.id;
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByIndexFn(index, item) {
        return index;
    }

    /*
    * @param column: any
    * @param contentField: any
    * @param withSymbol: boolean = true
    * @return cellValue with fieldSymbol
    */
    public getCellDisplayValue(column, contentField, withSymbol = true) {
        if (!this.data) return '';
        if (this.data[contentField.id][column] != '') {
            return (withSymbol ? this.getFieldSymbol(contentField.field_type) + ' ' : '') + this.data[contentField.id][column];
        } else {
            return '';
        }
    }

    /*
    * @param value: string
    * @param contentField: any
    * @param periodKey: string
    * @set cellValue
    * @do rowsColumnsSum
    */
    public setCellValue(value, contentField, periodKey) {
        this.data[contentField.id][periodKey] = this.formatValue(this.machineFormat(value));
        this.doRowsColumnsSum();
    }

    /*
    * @param contentField: any
    * @return rowSum with fieldSymbol | ''
    */
    public getRowSumDisplay(contentField) {
        if (!this.rowsSum && !this.data[contentField.id].sum) return '';
        let rowSum = this.data[contentField.id].sum || this.rowsSum[contentField.id];
        if (this.formatValue(rowSum) != '') {
            return `${this.getFieldSymbol(contentField.field_type)} ${this.formatValue(rowSum)}`;
        } else {
            return '';
        }
    }

    /*
    * @param value: string
    * @return money formatted value | ''
    */
    public formatValue(value) {
        value = parseFloat(value);
        return !isNaN(+value) && value != 0 ? this.userPrefs.formatMoney(+value) : '';
    }

    /*
    * @param value: string
    * @return number value without format | ''
    */
    public machineFormat(value) {
        if (value) {
            value = value.split(this.userPrefs.toUse.num_grp_sep).join('');
            value = value.split(this.userPrefs.toUse.dec_sep).join('.');
            if (isNaN(value = parseFloat(value))) return '';
            return Math.floor(+value * Math.pow(10, this.userPrefs.toUse.default_currency_significant_digits)) /
                Math.pow(10, this.userPrefs.toUse.default_currency_significant_digits);
        }
        return value;
    }

    /*
    * @openModal SalesPlanningToolContentNoteModal
    * @pass canEdit
    * @pass nodeInfo
    * @save contentNote
    */
    public viewNote() {
        this.modal.openModal('SalesPlanningToolContentNoteModal')
            .subscribe(modalRef => {
                modalRef.instance.canEdit = this.canEdit;
                modalRef.instance.nodeInfo = this.nodeInfo;
                modalRef.instance.doSave.subscribe(() => this.saveContentNote());
            });
    }

    /*
    * @save notice
    * @toast success
    * @set viewMode
    */
    public saveContentNote() {
        let body = {notice: this.nodeInfo.notice};
        this.backend.postRequest(`module/SalesPlanningContents/${this.planningService.versionId}/${this.nodeInfo.planningNode}/notice`, {}, body)
            .subscribe(result => {
                if (result.success == true) {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    this.setViewMode();
                }
            });
    }

    /*
    * @param fieldType: 'currency' | 'percentage' | mixed
    * @return symbol
    */
    public getFieldSymbol(fieldType) {
        switch (fieldType) {
            case 'currency':
                return '€';
            case 'percentage':
                return '%';
            default:
                return '';
        }
    }

    /*
    * @param color: string
    * @return isDarkColor: boolean
    */
    public isDarkColor(color) {
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
