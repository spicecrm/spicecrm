/**
 * @module ModuleReports
 */
import {
    Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {reporterconfig} from '../services/reporterconfig';

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-pivot',
    templateUrl: './src/modules/reports/templates/reporterdetailpresentationpivot.html'
})
export class ReporterDetailPresentationPivot implements AfterViewInit, OnInit {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;
    @ViewChild('tableheader', {read: ViewContainerRef, static: true}) private tableheader: ViewContainerRef;

    private presParams: any = {};
    private presData: any = {};
    private fieldsData: any = {};
    private totalWidth: number = 0;

    private isLoading: boolean = true;

    private pivotArray: any[] = [];
    private rowValues: any[] = [];

    constructor(private language: language, private model: model, private backend: backend, private reporterconfig: reporterconfig) {
        // subscribe to the refresh .. hapens when e.g. the filters are applied and the report items shoudl reload themselves
        this.reporterconfig.refresh$.subscribe(event => {
            this.getPresentation();
        });
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

    // todo : fix this for scrolling with a fixed table header
    private getContainerStyle(): any {
        let recth = this.tableheader.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + recth.height + 'px)'
        };
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
            for (let field of presData.reportmetadata.fields) {
                this.fieldsData[field.fieldid] = field;
                this.totalWidth += field.width;
            }

            this.presData = presData;

            // build the pivot
            this.buildPivot();

            this.isLoading = false;
        });
    }

    get dataName() {
        try {
            return this.presData.reportmetadata.fields.find(record => record.fieldid == this.presParams.pluginData.rowData).name;
        } catch (e) {
            return 'data';
        }
    }

    /**
     * builds a header aray based on teh records and the pivot settings
     */
    private buildPivot() {
        this.pivotArray = [];
        this.rowValues = [];
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
                    default:
                        headObject.values[record[this.presParams.pluginData.rowData]][value.fieldid] += parseFloat(record[value.fieldid]);
                        break;
                }
            }

            // check if we have the colValue
            if (this.rowValues.indexOf(record[this.presParams.pluginData.rowData]) == -1) this.rowValues.push(record[this.presParams.pluginData.rowData]);
        }
    }

    /**
     * returns the number of columns from the pivot
     * required for the RowSpan for the main row
     */
    get pivotColumnCount() {
        return this.presParams.pluginData.columnData.length;
    }

    /**
     * returns the total calculated number of columns
     */
    get totalColumnCount() {
        let totalColumns = 0;
        for (let itemData of this.pivotArray) {
            totalColumns += this.getColumns(itemData);
        }
        return totalColumns;
    }

    /**
     * subfunction to get the number of columns for one item row
     * called recursively
     *
     * @param item the item
     */
    private getColumns(item): number {
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
     * generates an aray that can be rendered as headser for the pivot table in the view
     */
    get headerTableSet() {
        let retArray = [];

        // check if we have an array for the pivot yet .. otherwise return an empty array
        if (this.pivotArray.length == 0) return retArray;

        let index = 0;
        for (let column of this.presParams.pluginData.columnData) {

            // add one column for the label
            /*
            let rowColumns = [{
                value: this.language.getLabel(this.presData.reportmetadata.fields.find(record => record.fieldid == column.fieldid).name),
                span: 1
            }];
            */

            retArray.push(this.getColumnsForId(column.fieldid));
        }

        return retArray;
    }

    /**
     * get the column record for a given fieldid
     *
     * @param fieldid
     */
    private getColumnsForId(fieldid, columns?) {
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

    private getValues(valuekey, columns?) {
        let valueArray = [];
        if (!columns) columns = this.pivotArray;
        for (let column of columns) {
            if (column.values) {
                let valuesArray = [];
                for (let value of this.presParams.pluginData.valueData) {
                    let field = this.presData.reportmetadata.fields.find(record => record.fieldid == value.fieldid);

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

    /**
     * returns the fields of the report
     */
    private getFields() {
        try {
            return this.presData.reportmetadata.fields;
        } catch (e) {
            return [];
        }
    }

    /**
     * returns the records of the report
     */
    private getRecords() {
        try {
            return this.presData.records;
        } catch (e) {
            return [];
        }
    }

    private getFieldWidth(fieldid) {
        return Math.round(this.fieldsData[fieldid].width / this.totalWidth * 100) + '%';
    }
}
