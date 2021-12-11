/**
 * @module ModuleReportsMore
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {reporterconfig} from '../../../modules/reports/services/reporterconfig';
import {Subscription} from "rxjs";

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-pivot',
    templateUrl: '../templates/reporterdetailpresentationpivot.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailPresentationPivot implements AfterViewInit, OnInit, OnDestroy {

    /**
     * array for pivot total count
     */
    public totalCountArray: any[] = [];
    /**
     * save the presentation params
     */
    public presParams: any = {};
    /**
     * save the presentation data
     */
    public presData: any = {};
    /**
     * save loading value on backend retrieve
     */
    public isLoading: boolean = true;
    /**
     * pivot data array
     */
    public pivotArray: any[] = [];
    /**
     * values of the pivot row
     */
    public rowValues: any[] = [];
    /**
     * holds the pivot header table set (rows)
     */
    public headerTableSet: any[] = [];
    /**
     * columns of the pivot row
     */
    public rowValueColumns: any = {};
    /**
     * holds any subscription
     */
    public subscriptions = new Subscription();
    /**
     * holds any subscription
     */
    public pivotNameField: string = 'LBL_DATA';


    constructor(public model: model,
                public backend: backend,
                public cdRef: ChangeDetectorRef,
                public reporterconfig: reporterconfig) {
        // subscribe to the refresh .. happen when e.g. the filters are applied and the report items should reload themselves
        this.subscriptions.add(
            this.reporterconfig.refresh$.subscribe(() => {
                this.getPresentation();
            })
        );
    }

    /**
     * get the presentation params
     */
    public ngOnInit() {
        this.presParams = this.model.getField('presentation_params');
    }

    /**
     * get and render the presentation once the view has initialized
     */
    public ngAfterViewInit() {
        this.getPresentation();
    }

    /**
     * unsubscribe from any subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * generates an array that can be rendered as header for the pivot table in the view
     */
    public setHeaderTableSet() {

        if (this.pivotArray.length == 0) return;

        let retArray = [];
        for (let column of this.presParams.pluginData.columnData) {
            retArray.push(this.getColumnsForId(column.fieldid));
        }
        this.headerTableSet = retArray;
    }

    /**
     * set pivot name field label
     */
    public setPivotNameField() {
        if (!!this.presData.reportmetadata) {
            const nameField = this.presData.reportmetadata.fields.find(record => record.fieldid == this.presParams.pluginData.rowData);
            this.pivotNameField = !!nameField ? nameField.name : 'LBL_DATA';
        }
    }

    /**
     * set total count array
     */
    public setTotalCountArray() {
        let totalColumns = 0;
        for (let itemData of this.pivotArray) {
            totalColumns += this.getColumns(itemData);
        }

        this.totalCountArray = Array(totalColumns).fill('data');
    }

    /**
     * get presentation fields and build the pivot
     */
    public getPresentation() {
        this.isLoading = true;
        this.cdRef.detectChanges();

        // build where condition
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

        this.backend.getRequest('module/KReports/' + this.model.id + '/presentation', {
            whereConditions: JSON.stringify(whereConditions),
            parentbeanId: this.model.getField('parentBeanId'),
            parentbeanModule: this.model.getField('parentBeanModule')
        }).subscribe((presData: any) => {

            this.presData = presData;
            // build the pivot
            this.buildPivot();
            this.setTotalCountArray();
            this.setHeaderTableSet();
            this.setPivotNameField();
            this.cdRef.detectChanges();
        });
    }

    /**
     * builds a header array based on teh records and the pivot settings
     * set the total count array
     */
    public buildPivot() {
        this.pivotArray = [];
        this.rowValues = [];
        this.cdRef.detectChanges();

        for (let record of this.presData.records) {
            let headObject: any;
            let headArray: any[] = this.pivotArray;
            for (let colum of this.presParams.pluginData.columnData) {
                headObject = headArray.find(item => item.value == record[colum.fieldid]);
                if (!headObject) {
                    headObject = {
                        fieldid: colum.fieldid,
                        value: record[colum.fieldid],
                        columns: [],
                        endnode: false
                    };
                    headArray.push(headObject);
                }
                headArray = headObject.columns;
            }

            for (let value of this.presParams.pluginData.valueData) {
                // initialize values if we do not have them
                if (!headObject.values) headObject.values = {};

                // set the values
                if (!headObject.values[record[this.presParams.pluginData.rowData]]) headObject.values[record[this.presParams.pluginData.rowData]] = {};
                if (!headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid]) headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid] = 0;

                // execute the function
                switch (value.pivotfunction) {
                    case 'COUNT':
                        headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid] = headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid] + 1;
                        break;
                    case 'MAX':
                        if (parseFloat(record[value.fieldid]) > headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid]) {
                            headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid] = parseFloat(record[value.fieldid]);
                        }
                        break;
                    case 'MIN':
                        if (parseFloat(record[value.fieldid]) < headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid]) {
                            headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid] = parseFloat(record[value.fieldid]);
                        }
                        break;
                    default:
                        headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid] += parseFloat(record[value.fieldid]);
                        break;
                }
            }

            // check if we have the colValue
            if (this.rowValues.indexOf(record[this.presParams.pluginData.rowData]) == -1 && !!record[this.presParams.pluginData.rowData]) this.rowValues.push(record[this.presParams.pluginData.rowData]);
        }

        for (let rowValue of this.rowValues) {
            this.rowValueColumns[rowValue] = this.getValues(rowValue);
        }

        this.isLoading = false;
        this.cdRef.detectChanges();
    }

    /**
     * subfunction to get the number of columns for one item row
     * called recursively
     *
     * @param item the item
     */
    public getColumns(item): number {
        let columns: number = 0;
        if (item.columns.length > 0) {
            for (let column of item.columns) {
                columns += this.getColumns(column);
            }
        } else {
            columns = 1;
        }
        return columns;
    }

    /**
     * get the column record for a given fieldid
     * @param fieldid
     * @param columns
     */
    public getColumnsForId(fieldid, columns?) {
        let columnArray = [];
        if (!columns) columns = this.pivotArray;
        for (let column of columns) {
            if (column.fieldid == fieldid) {
                columnArray.push({
                    value: column.value,
                    span: this.getColumns(column)
                });
            } else {
                columnArray = columnArray.concat(this.getColumnsForId(fieldid, column.columns));
            }
        }
        return columnArray;
    }

    /**
     * get values for row column
     * @param valuekey
     * @param columns
     */
    public getValues(valuekey, columns?) {
        let valueArray = [];
        if (!columns) columns = this.pivotArray;
        for (let column of columns) {
            if (column.values) {
                let valuesArray = [];
                for (let value of this.presParams.pluginData.valueData) {
                    let field = this.presData.reportmetadata.fields.find(record => record.fieldid == value.fieldid);

                    // if a specific renderer is set use it
                    if (value.pivotrenderer) field.type = value.pivotrenderer;

                    if (column.values[valuekey] && column.values[valuekey][value.fieldid]) {
                        valuesArray.push({
                            field: field,
                            value: column.values[valuekey][value.fieldid]
                        });
                    } else {
                        valuesArray.push({
                            field: field,
                            value: ''
                        });
                    }
                }
                valueArray.push(valuesArray);
            } else {
                valueArray = valueArray.concat(this.getValues(valuekey, column.columns));
            }
        }
        return valueArray;
    }
}
