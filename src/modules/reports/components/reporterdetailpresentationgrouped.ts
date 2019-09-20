/**
 * @module ModuleReports
 */
import {
    Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-grouped',
    templateUrl: './src/modules/reports/templates/reporterdetailpresentationgrouped.html'
})
export class ReporterDetailPresentationGrouped implements AfterViewInit, OnInit {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;
    @ViewChild('tableheader', {read: ViewContainerRef, static: true}) private tableheader: ViewContainerRef;
    @ViewChild('tablesummary', {read: ViewContainerRef, static: true}) private tablesummary: ViewContainerRef;
    @ViewChild('tablefooter', {read: ViewContainerRef, static: true}) private tablefooter: ViewContainerRef;

    private presParams: any = {};
    private presData: any = {};
    private fieldsData: any = {};
    private totalWidth: number = 0;
    private showFooter: boolean = true;
    private currentPage: number = 1;
    private isLoading: boolean = true;

    private _groupById: string = '';
    private groupByValues: any[] = [];
    private totalRecord: {};
    private reportFields: any[] = [];

    constructor(private metadata: metadata, private model: model, private backend: backend, private reporterconfig: reporterconfig, private language: language) {
        this.reporterconfig.refresh$.subscribe(event => {
            this.getPresentation();
        });
    }

    get groupById() {
        return this._groupById;
    }

    set groupById(value) {
        if (value != this._groupById) {
            this._groupById = value;

            // determine values
            this.groupByValues = [];
            let groupByValues = {};
            for (let record of this.presData.records) {
                if (!groupByValues[record[value]]) groupByValues[record[value]] = 0;
                groupByValues[record[value]]++;
            }

            for (let groupByValue in groupByValues) {
                this.groupByValues.push({
                    value: groupByValue,
                    count: groupByValues[groupByValue],
                    totalRecord: this.buildSummary(this.getRecords(groupByValue))
                });
            }
        }
    }

    public ngOnInit() {
        this.presParams = JSON.parse(this.model.data.presentation_params);
    }

    public ngAfterViewInit() {
        this.getPresentation();
    }

    // todo : fix this for scrolling with a fixed table header
    private getContainerStyle(): any {
        let recth = this.tableheader.element.nativeElement.getBoundingClientRect();
        let rects = this.tablesummary.element.nativeElement.getBoundingClientRect();
        if (this.showFooter) {
            let rectf = this.tablefooter.element.nativeElement.getBoundingClientRect();
            return {
                height: 'calc(100% - ' + (rects.height + recth.height + rectf.height) + 'px)'
            };
        } else {
            return {
                height: 'calc(100% - ' + (rects.height + recth.height) + 'px)'
            };
        }
    }

    get totalRecords() {
        return this.presData.count;
    }

    private getPresentation() {
        this.isLoading = true;

        // build wherecondition
        let whereConditions: any[] = [];
        for (let userFilter of this.reporterconfig.userFilters) {
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            });
        }

        this.backend.getRequest('KReporter/' + this.model.id + '/presentation', {
            whereConditions: JSON.stringify(whereConditions),
            parentbeanId: this.model.getField('parentBeanId'),
            parentbeanModule: this.model.getField('parentBeanModule')
        }).subscribe((presData: any) => {

            // get field width
            this.totalWidth = 0;
            this.reportFields = [];
            for (let field of presData.reportmetadata.fields) {
                this.fieldsData[field.fieldid] = field;
                this.totalWidth += field.width;

                // set teh reporter fields for the select
                this.reportFields.push({
                    fieldid: field.fieldid,
                    name: field.name,
                });
            }

            // set the pres data
            this.presData = presData;

            // set the group by id
            this.groupById = presData.reportmetadata.presentation_params.pluginData.groupedViewProperties.groupById;

            this.totalRecord = this.buildSummary(this.presData.records);

            this.isLoading = false;
        });
    }

    private getFields() {
        try {
            return this.presData.reportmetadata.fields;
        } catch (e) {
            return [];
        }
    }

    private buildSummary(records) {
        let fields = this.presData.metaData.gridColumns.filter(column => column.summaryType);
        if (fields.length < 1) return [];

        let summaryrecord = {};
        for (let field of fields) {
            summaryrecord[field.dataIndex] = {
                value: 0,
                count: 0,
                function: field.summaryType
            };
        }

        for (let record of records) {
            for (let dataIndex in summaryrecord) {
                switch (summaryrecord[dataIndex].function) {
                    case 'sum':
                        summaryrecord[dataIndex].value += parseFloat(record[dataIndex]);
                        summaryrecord[dataIndex].count++;
                        break;
                    case 'count':
                        summaryrecord[dataIndex].value++;
                        summaryrecord[dataIndex].count++;
                        break;
                }
            }
        }

        let retRecord = {};
        for (let dataIndex in summaryrecord){
            retRecord[dataIndex] = summaryrecord[dataIndex].value;
        }
        return retRecord;
    }

    private getRecords(groupvalue): any[] {
        try {
            return this.presData.records.filter(record => record[this._groupById] == groupvalue);
        } catch (e) {
            return [];
        }
    }

    private getRecordTotals() {
        try {
            return this.presData.recordtotal;
        } catch (e) {
            return [];
        }
    }

    private getFieldWidth(fieldid) {
        return Math.round(this.fieldsData[fieldid].width / this.totalWidth * 100) + '%';
    }

}
