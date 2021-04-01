/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    /*
    * @reset periods
    * @push period: {key: string, name:string}
    * @sort periods by default
    */
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

    /*
    * @reset nodeInfo
    * @get nodeInfo
    * @get nodeContent
    */
    private getNodeInfo() {
        if (!this.node) return;
        this.isLoading = true;
        this.nodeInfo = undefined;
        this.nodeCrumbs = [];
        let params = {
            pathArray: this.planningService.selectedNodesIds,
            characteristics: this.planningService.selectedNode.level > 1 ? this.planningService.selectedCharacteristicIds : [this.planningService.characteristicTerritory],
        };
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/NodeInfo`, params)
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

    /*
    * @calculate columnFields
    * @calculate rowsTotals
    */
    private doRowsColumnsSum() {
        this.calculateColumnFields();
        this.calculateRowsTotals();
    }

    /*
    * @calculate cellValue if formula is set
    */
    private calculateColumnFields() {
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
    private calculateRowsTotals() {
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
    private getCellValue(fieldData, formula, periodKey) {
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
    private getRowSum(formulaSum) {
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

    /*
    * @param data: any
    * @format cellValue
    * @return data: any
    */
    private formatAllData(data) {
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
    private machineFormatAllData(data) {
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
    private setEditMode() {
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
    private setViewMode() {
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

        this.data = this.formatAllData(this.data);
    }

    /*
    * @openModal SalesPlanningToolInputHelperModal
    * @pass contentFields
    * @pass periods
    * @execute inputHelperData
    */
    private openInputHelper() {
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
    private executeInputHelperData(res) {
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
    private cancel() {
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
    private trackByItemFn(index, item) {
        return item.id;
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByIndexFn(index, item) {
        return index;
    }

    /*
    * @param column: any
    * @param contentField: any
    * @param withSymbol: boolean = true
    * @return cellValue with fieldSymbol
    */
    private getCellDisplayValue(column, contentField, withSymbol = true) {
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
    private setCellValue(value, contentField, periodKey) {
        this.data[contentField.id][periodKey] = this.formatValue(this.machineFormat(value));
        this.doRowsColumnsSum();
    }

    /*
    * @param contentField: any
    * @return rowSum with fieldSymbol | ''
    */
    private getRowSumDisplay(contentField) {
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
    private formatValue(value) {
        value = parseFloat(value);
        return !isNaN(+value) && value != 0 ? this.userPrefs.formatMoney(+value) : '';
    }

    /*
    * @param value: string
    * @return number value without format | ''
    */
    private machineFormat(value) {
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
    private viewNote() {
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

    /*
    * @param fieldType: 'currency' | 'percentage' | mixed
    * @return symbol
    */
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

    /*
    * @param color: string
    * @return isDarkColor: boolean
    */
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
