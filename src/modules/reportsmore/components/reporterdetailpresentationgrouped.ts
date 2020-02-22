/**
 * @module ModuleReportsMore
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {reporterconfig} from '../../../modules/reports/services/reporterconfig';
import {ReporterDetailPresentationStandard} from "../../reports/components/reporterdetailpresentationstandard";

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-grouped',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailpresentationgrouped.html'
})
export class ReporterDetailPresentationGrouped extends ReporterDetailPresentationStandard {


    /**
     * the id of the field the reports i grouped by
     */
    private _groupById: string = '';

    /**
     * the values for the group by caluse
     */
    private groupByValues: any[] = [];

    /**
     * the total record
     */
    private totalRecord: {};

    /**
     * the reporter fields for the select for the group ba clause
     */
    private reportFields: any[] = [];

    /**
     * indicates if the report has a summary
     */
    private hasSummary: boolean = false;


    constructor(public language: language, public model: model, public backend: backend, public reporterconfig: reporterconfig, public toast: toast) {
        super(language, model, backend, reporterconfig, toast);
    }

    /**
     * simple gettr for the group by id
     */
    get groupById() {
        return this._groupById;
    }

    /**
     * setter for the group by that also triggers rebuilding of the total values
     *
     * @param value
     */
    set groupById(value) {
        if (value != this._groupById) {
            this._groupById = value;

            // rebuild the groups
            this.rebuildGroups();
        }
    }

    /**
     * rebuilds the groups
     */
    private rebuildGroups() {
        // determine values
        this.groupByValues = [];
        let groupByValues = {};
        for (let record of this.presData.records) {
            if (!groupByValues[record[this._groupById]]) groupByValues[record[this._groupById]] = 0;
            groupByValues[record[this._groupById]]++;
        }

        for (let groupByValue in groupByValues) {
            this.groupByValues.push({
                value: groupByValue,
                expanded: true,
                count: groupByValues[groupByValue],
                totalRecord: this.buildSummary(this.getGroupedRecords(groupByValue))
            });
        }
    }

    /**
     * postprocess the presentation data
     */
    public processPresData() {
        // check if we have a summary to be displayed
        let fields = this.presData.metaData.gridColumns.filter(column => column.summaryType);
        this.hasSummary = fields.length > 0;

        // set the group by id if it is not set already
        if (!this._groupById) this._groupById = this.presData.reportmetadata.presentation_params.pluginData.groupedViewProperties.groupById;


        // rebuild the grouped sums and count
        this.rebuildGroups();

        this.totalRecord = this.buildSummary(this.presData.records);

        // buid the fields for the group by select
        this.reportFields = [];
        for (let field of this.presData.reportmetadata.fields) {
            this.fieldsData[field.fieldid] = field;
            this.totalWidth += field.width;

            // set the reporter fields for the select
            this.reportFields.push({
                fieldid: field.fieldid,
                name: field.name,
            });
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
        for (let dataIndex in summaryrecord) {
            retRecord[dataIndex] = summaryrecord[dataIndex].value;
        }
        return retRecord;
    }

    private getRecordTotals() {
        try {
            return this.presData.recordtotal;
        } catch (e) {
            return [];
        }
    }


    public getGroupedRecords(groupvalue): any[] {
        try {
            return this.presData.records.filter(record => record[this._groupById] == groupvalue);
        } catch (e) {
            return [];
        }
    }


}
