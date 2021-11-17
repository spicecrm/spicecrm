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
 * @module AdminComponentsModule
 */
import {Component, Input, OnInit} from '@angular/core';
import {backend} from "../../services/backend.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'administration-job-failed-list',
    templateUrl: './src/admincomponents/templates/administrationjobfailedlist.html'
})
export class AdministrationJobFailedList implements OnInit {
    /**
     * if true apply box border class on the container
     */
    @Input() public hasBoxClass = false;
    /**
     * holds the failed jobs
     */
    public failedJobs: { list: Array<{ id, name, last_run_date, last_run_message, resolution }>, total: number, isLoading: boolean, hasError?: boolean } = {
        list: [],
        total: 0,
        isLoading: false
    };

    constructor(private language: language,
                private modal: modal,
                private metadata: metadata,
                public backend: backend) {
    }

    /**
     * reload the list of jobs
     */
    public ngOnInit() {
        this.reloadList();
    }

    /**
     * reload failed jobs
     */
    public reloadList() {

        this.failedJobs.list = [];
        this.failedJobs.total = 0;
        this.failedJobs.hasError = false;

        const config = this.metadata.getComponentConfig('AdministrationJobFailedList', 'SchedulerJobs');

        if (!config.moduleFilter) {
            this.failedJobs.hasError = true;
            return console.error('Mssing module filter for component AdministrationJobFailedList');
        }

        this.failedJobs.isLoading = true;

        const params = {
            modulefilter: config.moduleFilter,
            start: 0,
            limit: 20
        };
        const sortArray = [{
            sortfield: 'last_run_date',
            sortdirection: 'DESC'
        }];

        this.backend.getList('SchedulerJobs', sortArray, params).subscribe(
            (res: any) => {
                this.failedJobs.list = res.list;
                this.failedJobs.total = res.totalcount;
                this.failedJobs.isLoading = false;
            },
            error => {
                this.failedJobs.isLoading = false;
                this.failedJobs.hasError = true;
            }
        );
    }

    /**
     * reload failed jobs
     */
    public loadMore() {

        if (this.failedJobs.isLoading || this.failedJobs.list.length >= this.failedJobs.total) {
            return false;
        }

        const config = this.metadata.getComponentConfig('AdministrationJobFailedList', 'SchedulerJobs');

        if (!config.moduleFilter) {
            this.failedJobs.hasError = true;
            return console.error('Mssing module filter for component AdministrationJobFailedList');
        }

        this.failedJobs.isLoading = true;

        const params = {
            modulefilter: config.moduleFilter,
            start: this.failedJobs.list.length,
            limit: 20
        };
        const sortArray = [{
            sortfield: 'last_run_date',
            sortdirection: 'DESC'
        }];

        this.backend.getList('SchedulerJobs', sortArray, params).subscribe(
            (res: any) => {
                this.failedJobs.list = res.list;
                this.failedJobs.total = res.totalcount;
                this.failedJobs.isLoading = false;
            },
            error => {
                this.failedJobs.isLoading = false;
                this.failedJobs.hasError = true;
            }
        );
    }

    /**
     * open the error message in an extra info modal
     * @param text
     * @param resolution
     */
    public openMessageInModal(text: string, resolution: 'failed' | 'done') {
        const theme = resolution == 'failed' ? 'error' : 'success';
        this.modal.info(text, this.language.getLabel('LBL_MESSAGE'), theme);
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    protected trackByFn(index, item) {
        return item.id;
    }
}
