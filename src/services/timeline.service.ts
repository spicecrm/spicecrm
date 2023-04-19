/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {model} from "./model.service";
import {backend} from "./backend.service";
import {metadata} from "./metadata.service";
import {broadcast} from "./broadcast.service";
import {modelutilities} from "./modelutilities.service";

declare var moment;

export interface response {
    records: moduleRecord[] | auditRecord[];
    endDate: string;
    moduleEnd: string;
    auditLogEnd: string;
    moduleSearch: boolean;
    auditSearch: boolean;
    counts: [];
    timelineModules: [];
}

export interface moduleRecord {
    id: string;
    module: string;
    date: string;
    related_ids: string[];
    record_Type: string;
    data: object;
}

export interface auditRecord {
    id: string;
    date: string;
    created_by: string;
    user_name: string;
    record_Type: string;
    data: any[];
}

@Injectable()
export class timeline {

    public parent: model;

    public smartView = false;

    public smartFontSize = false;

    public records: object[] = [];

    public checking: boolean = false;

    public newRecords: object[];

    public loading = false;

    public loadingMore = false;

    public startDate = null;

    public timeRangeStart = new moment();

    public record;

    public timelineModules: string[] = [];

    public onlyAudits: boolean = false;
    /**
     * an object for filters to be applied
     */
    public filters: any = {
        searchterm: '',
        objectfilters: ['auditLog', 'Modules'],
        own: ''
    };
    /**
     * an object for filters to be applied
     */
    public searchTerm = '';
    public auditLogEnabled = false;
    /**
     * holds value for detail View in fullscreen view
     */
    public recordModule: string;
    /**
     * holds value for detail View in fullscreen view
     */
    public recordId: string;
    /**
     * holds value for detail View in fullscreen view
     */
    public recordData: any;
    /**
     * checks if a reload is initiated
     * @private
     */
    public initial = true;
    /**
     * indicates how many module records have been found
     * @private
     */
    public totalModuleRecords = 0;
    /**
     * indicates how many audit records have already been loaded
     * @private
     */
    public loadedAuditRecords = 0;
    /**
     * indicates how many audit records have been found
     * @private
     */
    public totalAuditRecords = 0;
    /**
     * indicates how many audit records have already been loaded
     * @private
     */
    public loadedModuleRecords = 0;
    /**
     * indicates if searching for module records is disabled
     * @private
     */
    public moduleSearch = true;
    /**
     * indicates if searching for audit records is disabled
     * @private
     */
    public auditSearch: any = true;

    constructor(public modelutilities: modelutilities, public backend: backend, public metadata: metadata, public broadcast: broadcast, public model: model) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    get rangeStart() {
        console.log(this.timeRangeStart.format());
        return this.timeRangeStart.format();
    }

    /**
     * getter to check if moduleSearch should be deactivated
     */
    get getModuleSearch() {
        return this.totalModuleRecords !== this.loadedModuleRecords;
    }

    /**
     * getter to check if auditSearch should be deactivated
     */
    get getAuditSearch() {
        return this.totalAuditRecords !== this.loadedAuditRecords;

    }

    get totalRecords() {
        return this.totalAuditRecords + this.totalModuleRecords;
    }

    public reload(silent: boolean = false, end = '') {

        this.initial = true;
        this.startDate = this.rangeStart;
        this.loadedModuleRecords = 0;
        this.loadedAuditRecords = 0;
        this.totalAuditRecords = 0;
        this.totalModuleRecords = 0;
        this.moduleSearch = true;
        this.auditSearch = true;
        if(!silent) this.records = [];
        this.getTimelineData(silent, end);

    }

    public getTimelineData(silent: boolean = false, end = '') {

        if (!silent) {
            this.loading = true;
        }

        // define body
        let body = {
            endDate: end,
            startDate: this.startDate,
            searchTerm: this.filters.searchterm,
            moduleSearch: this.moduleSearch,
            auditSearch: this.auditSearch,
            own: this.filters.own,
            objects: JSON.stringify(this.filters.objectfilters),
            timeRangeStart: this.rangeStart
        };

        console.log(body);

        this.backend.postRequest('module/Timeline/' + this.parent.module + '/' + this.parent.id, {}, body).subscribe(
            (response: response) => {
                console.log(response);
                for (let record of response.records) {
                    if (record.hasOwnProperty('module')) {
                        // @ts-ignore
                        record.data = this.modelutilities.backendModel2spice(record.module, record.data);
                    }
                }

                this.getBody(response, this.initial);

                // add records and check if module Creation record should be included
                this.addRecords(response.records, silent);
                this.loading = false;
            }
        );
    }

    public loadMore() {

        this.loadingMore = true;

        // define body
        let body = {
            endDate: '',
            startDate: this.startDate,
            searchTerm: this.filters.searchterm,
            moduleSearch: this.getModuleSearch,
            auditSearch: this.getAuditSearch,
            own: this.filters.own,
            objects: JSON.stringify(this.filters.objectfilters),
            timeRangeStart: this.rangeStart
        };

        this.backend.postRequest('module/Timeline/' + this.parent.module + '/' + this.parent.id, {}, body).subscribe(
            (response: any) => {
                console.log(response);
                for (let record of response.records) {
                    record.data = this.modelutilities.backendModel2spice(record.module, record.data);
                }
                this.getBody(response, this.initial);

                // add records and check if module Creation record should be included
                this.addRecords(response.records);

                this.loadingMore = false;
            }
        );
    }

    /**
     * sets the values for detail view in timeline fullscreen view
     * @param record
     */
    public setRecord(record) {
        if (!record.hasOwnProperty('data')) {
            this.recordModule = this.parent.module;
            this.recordId = this.parent.id;
            this.recordData = record;
            return;
        }
        this.recordModule = record.hasOwnProperty('module') ? record.module : 'Audit';
        this.recordId = record.id;
        this.recordData = record.hasOwnProperty('module') ? record.data : record;
    }

    public clearRecord() {
        this.recordModule = '';
        this.recordId = '';
        this.recordData = '';
    }

    /**
     * checks if more datat can be loaded
     */
    public canLoadMore() {
        return !(this.loading || this.loadingMore ||
            (this.totalAuditRecords === this.loadedAuditRecords && this.totalModuleRecords === this.loadedModuleRecords) ||
            (!this.moduleSearch && !this.auditSearch));

    }

    /**
     * @ignore
     *
     * internal function to handle broacast messages
     *
     * @param message the broadcast message
     */
    public handleMessage(message: any) {
        let messageType = message.messagetype.split('.');
        if (messageType[0] === 'model') {
            // handle the message type
            switch (messageType[1]) {
                case 'merge':
                    // check if the current parent just finished a merge so we shoudl reload the activities
                    this.reload(true, this.startDate);
                    console.log(1);
                    break;
                case 'save':
                    this.reload(true, this.startDate);
                    console.log(2);
                    break;
                case 'delete':
                    console.log(3);
                    let deleted = false;
                    if (this.timelineModules.indexOf(message.messagedata.module) >= 0) {
                        this.records.some((record: any, index: number) => {
                            if (record.hasOwnProperty('date')) {
                                if (record.module === message.messagedata.module, record.id === message.messagedata.id) {
                                    // remove the item
                                    this.records.splice(index, 1);
                                    // reload silently
                                    this.reload(true, this.startDate);
                                    // set that we deleted
                                    deleted = true;
                                    return true;
                                }
                            }
                        });
                    }
                    break;
            }
        }
    }

    /**
     * adds record to already loaded records and adds module Creation record if needed
     * @param records
     * @private
     */
    public addRecords(records: moduleRecord[] | auditRecord[], silent = false) {
        if (this.totalAuditRecords === this.loadedAuditRecords && this.totalModuleRecords === this.loadedModuleRecords && this.searchTerm === '' && this.filters.own === '' && this.filters.objectfilters.indexOf('Modules') >= 0) {

            if (this.timeRangeStart.isAfter(this.parent.getField('date_entered'))) {

                let origin = this.parent.data;

                if (records.length !== 0 && origin.date_entered.format('YYYY-MM') !== records.slice(-1)[0].date.substring(0, 7)) {
                    origin.divider = origin.date_entered.format('YYYY-MM');
                }
                records.push(origin);
            }
        }
        if(silent) this.records = records;
        else this.records = this.records.concat(records);

    }

    public getBody(response, initial) {
        if (initial) {
            this.totalModuleRecords = response.counts.totalModules;
            this.totalAuditRecords = response.counts.totalAudits;
            this.timelineModules = response.timelineModules;
            this.auditLogEnabled = false;
            if (response.timelineModules.indexOf('auditLog') >= 0) {
                this.timelineModules.splice(response.timelineModules.indexOf('auditLog'), 1);
                this.auditLogEnabled = true;
            }
            this.initial = false;
        }
        this.startDate = response.endDate;

        this.loadedModuleRecords += response.counts.modulesTook;
        this.loadedAuditRecords += response.counts.auditsTook;

        this.auditSearch = response.auditSearch;
        this.moduleSearch = response.moduleSearch;
    }
}

