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
 * @module ModuleReportsMore
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {reporterconfig} from '../../../modules/reports/services/reporterconfig';
import {ReporterDetailPresentationStandard} from "../../../modules/reports/components/reporterdetailpresentationstandard";

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-grouped',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailpresentationgrouped.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailPresentationGrouped extends ReporterDetailPresentationStandard {


    /**
     * the values for the group by cal use
     */
    protected groupByValues: any[] = [];
    /**
     * the reporter fields for the select for the group ba clause
     */
    protected reportFields: any[] = [];
    /**
     * indicates if the report has a summary
     */
    private hasSummary: boolean = false;

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public injector: Injector,
                public backend: backend,
                public reporterconfig: reporterconfig,
                public cdRef: ChangeDetectorRef,
                public toast: toast) {
        super(language, model, modal, injector, backend, reporterconfig, cdRef, toast);
    }

    /**
     * the id of the field the reports i grouped by
     */
    private _groupById: string = '';

    /**
     * simple getter for the group by id
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
     * returns the set list entries from the pres params if set ... by default 25
     */
    get listEntries() {
        return 1000;
    }

    /**
     * postprocess the presentation data
     */
    public processPresData() {
        // check if we have a summary to be displayed
        let fields = this.presData.metaData.gridColumns.filter(column => !!column.summaryType);
        this.hasSummary = fields.length > 0;

        // set the group by id if it is not set already
        if (!this._groupById) this._groupById = this.presData.reportmetadata.presentation_params.pluginData.groupedViewProperties.groupById;


        // rebuild the grouped sums and count
        this.rebuildGroups();

        // build the fields for the group by select
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

    public getGroupedRecords(groupvalue): any[] {
        try {
            return this.presData.records.filter(record => record[this._groupById] == groupvalue);
        } catch (e) {
            return [];
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
            if (!groupByValues[record[this._groupById]]) {
                groupByValues[record[this._groupById]] = 0;
            }
            groupByValues[record[this._groupById]]++;
        }

        for (let groupByValue in groupByValues) {
            this.groupByValues.push({
                value: groupByValue,
                expanded: true,
                count: groupByValues[groupByValue],
                totalRecord: this.buildSummary(this.getGroupedRecords(groupByValue)),
                records: this.getGroupedRecords(groupByValue)
            });
        }
    }

    private buildSummary(records) {
        let fields = this.presData.metaData.gridColumns.filter(column => column.summaryType);
        if (fields.length < 1) return {};

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
}
