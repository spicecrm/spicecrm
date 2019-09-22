/**
 * @module ModuleReports
 */
import {
    Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-tree',
    templateUrl: './src/modules/reports/templates/reporterdetailpresentationtree.html'
})
export class ReporterDetailPresentationTree implements AfterViewInit, OnInit {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;
    @ViewChild('tableheader', {read: ViewContainerRef, static: true}) private tableheader: ViewContainerRef;
    @ViewChild('tablefooter', {read: ViewContainerRef, static: true}) private tablefooter: ViewContainerRef;

    private presParams: any = {};
    private presData: any = {};
    private fields: any[] = [];
    private fieldsData: any = {};
    private totalWidth: number = 0;


    private isLoading: boolean = true;

    /**
     * the array of fields to be displayed for the report
     * this is loaded initially with all feilds and then limited to one for all in the tree and then all the others
     */
    private treeDisplayFields: any[] = [];

    /**
     * holds the report data
     */
    private reportRecords: any[] = [];

    /**
     * the fields the tree is grouped by
     */
    private groupFields: any[] = [];

    constructor(private language: language, private model: model, private backend: backend, private reporterconfig: reporterconfig) {
        this.reporterconfig.refresh$.subscribe(event => {
            this.getPresentation();
        });
    }


    public ngOnInit() {
        this.presParams = this.model.getField('presentation_params');
    }

    public ngAfterViewInit() {
        this.getPresentation();
    }

    private displayClasses(field) {
        let classes = [];

        if (field.sortable) classes.push('slds-is-sortable');

        switch (field.type) {
            case 'currency':
            case 'currencyint':
                classes.push('slds-grid--align-end')
                break;
            case 'enum':
                classes.push('slds-grid--align-center')
                break;
        }

        return classes.join(' ');
    }

    private getContainerStyle(): any {
        let recth = this.tableheader.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + recth.height + 'px)'
        };
    }

    /**
     * returns the name of the grouped fields in the tree we can expand on
     */
    get groupFieldName() {
        let groupNames = [];
        for (let groupField of this.groupFields) {
            groupNames.push(groupField.text);
        }
        return groupNames.join(' / ');
    }

    /**
     * returns the field entry for the first field to be displayed
     */
    get lastGroupField() {
        return this.fields[this.groupFields.length - 1];
    }

    private getPresentation() {
        this.isLoading = true;

        this.backend.getRequest('KReporter/Tree/' + this.model.id + '/columns', {}).subscribe((columns: any) => {
            let treeStopReached = false;

            // set to the fields
            this.fields = columns;

            // loop through the columns
            for (let column of columns) {
                this.fieldsData[column.dataIndex] = column;

                if (treeStopReached) {
                    this.treeDisplayFields.push(column);
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
        });
    }

    private getNode(node) {
        let depth = 0;
        if (node != 'root') {
            let depthArray = node.split('::');
            depth = depthArray.length;
        }

        // find the current node
        let index = this.reportRecords.findIndex(record => record.node == node);

        // if not laoded - load it
        if (index < 0 || !this.reportRecords[index].loaded) {
            this.backend.postRequest('KReporter/Tree/' + this.model.id + '/node/' + btoa(node)).subscribe(reportData => {
                let newRecords = [];

                // if we found the record mark as loaded and expanded
                if (index >= 0) {
                    this.reportRecords[index].loaded = true;
                    this.reportRecords[index].expanded = true;
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
                    reportRecord.visible = true;

                    // insert after the last node
                    insertIndex++;
                    this.reportRecords.splice(insertIndex, 0, reportRecord);
                }
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
        }

    }

    private getFields() {
        try {
            return this.presData.reportmetadata.fields;
        } catch (e) {
            return [];
        }
    }

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
