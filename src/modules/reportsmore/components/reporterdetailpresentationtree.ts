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
    selector: 'reporter-detail-presentation-tree',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailpresentationtree.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailPresentationTree extends ReporterDetailPresentationStandard {

    /**
     * the array of fields to be displayed for the report
     * this is loaded initially with all feilds and then limited to one for all in the tree and then all the others
     */
    protected treeDisplayFields: any[] = [];
    /**
     * the fields the tree is grouped by
     */
    protected groupFields: any[] = [];
    /**
     * the field to be displayed
     */
    private fields: any[] = [];
    /**
     * holds the report data
     */
    private reportRecords: any[] = [];

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public injector: Injector,
                public backend: backend,
                public reporterconfig: reporterconfig,
                public cdRef: ChangeDetectorRef,
                public toast: toast) {
        super(language, model, modal, injector, backend, reporterconfig, cdRef, toast);

        // no footer
        this.showFooter = false;
    }

    /**
     * override the getPresentation method from standard component
     */
    public getPresentation() {
        this.isLoading = true;
        this.cdRef.detectChanges();

        this.backend.getRequest('KReporter/Tree/' + this.model.id + '/columns', {}).subscribe((columns: any) => {

            let treeStopReached = false;

            // set to the fields
            this.fields = columns;

            // reset the fields
            this.treeDisplayFields = [];
            this.groupFields = [];
            this.reportRecords = [];
            this.cdRef.detectChanges();

            // loop through the columns
            for (let column of columns) {
                this.fieldsData[column.dataIndex] = column;

                if (treeStopReached) {
                    // KPP-124 do not display hidden fields in tree
                    if(column.hidden !== true) {
                        this.treeDisplayFields.push(column);
                    }
                } else {
                    this.groupFields.push(column);
                }

                if (!treeStopReached && column.dataIndex == this.presParams.pluginData.stopTreeAt) {
                    treeStopReached = true;
                }
            }

            // get the root records
            this.getNode('root');

            this.isLoading = false;
            this.cdRef.detectChanges();
        });
    }

    /**
     * function to get the node when the node is expanded
     * @param node
     */
    private getNode(node) {
        let depth = 0;
        if (node != 'root') {
            let depthArray = node.split('::');
            depth = depthArray.length;
        } else {
            this.reportRecords = [];
        }
        this.cdRef.detectChanges();

        // build where conditions
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

        let body = {
            whereConditions: JSON.stringify(whereConditions),
            parentbeanId: (this.model as any).parentBeanId,
            parentbeanModule: (this.model as any).parentBeanModule,
        };

        // find the current node
        let index = this.reportRecords.findIndex(record => record.node == node);

        // if not loaded - load it
        if (index < 0 || !this.reportRecords[index].loaded) {

            if (index >= 0) {
                if (this.reportRecords[index].isLoading) return;
                this.reportRecords[index].isLoading = true;
                this.cdRef.detectChanges();
            }


            this.backend.postRequest('KReporter/Tree/' + this.model.id + '/node/' + encodeURIComponent(btoa(node)), {}, body).subscribe(reportData => {

                if (!reportData) return;

                // if we found the record mark as loaded and expanded
                if (index >= 0) {
                    this.reportRecords[index].loaded = true;
                    this.reportRecords[index].expanded = true;
                    this.reportRecords[index].isLoading = false;
                }

                // keep a separate insert index and do mot overwrte the index of the record
                let insertIndex = index;

                for (let reportRecord of reportData) {
                    // build the node
                    let thisnode = node != 'root' ? node + '::' : '';
                    reportRecord.node = thisnode + this.fields[depth].fieldid + ':' + (reportRecord[this.fields[depth].fieldid + '_val'] ? reportRecord[this.fields[depth].fieldid + '_val'] : reportRecord[this.fields[depth].fieldid]);
                    reportRecord.parentnode = node;
                    reportRecord.depth = depth;
                    reportRecord.expanded = false;
                    reportRecord.loaded = false;
                    reportRecord.isLoading = false;
                    reportRecord.visible = true;

                    // insert after the last node
                    insertIndex++;
                    this.reportRecords.splice(insertIndex, 0, reportRecord);
                }
                this.cdRef.detectChanges();
            });
        } else {
            this.reportRecords[index].expanded = !this.reportRecords[index].expanded;

            // collapse all items
            if (!this.reportRecords[index].expanded) {
                for (let record of this.reportRecords.filter(record => record.parentnode.indexOf(node) == 0)) {
                    record.expanded = false;
                    record.visible = false;
                }
            } else {
                for (let record of this.reportRecords.filter(record => record.parentnode == node)) {
                    record.visible = true;
                }
            }
            this.cdRef.detectChanges();
        }
    }
}
