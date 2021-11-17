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
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'administration-job-running-list',
    templateUrl: './src/admincomponents/templates/administrationjobrunninglist.html'
})
export class AdministrationJobRunningList implements OnInit {
    /**
     * if true apply box border class on the container
     */
    @Input() public hasBoxClass = false;
    /**
     * holds the running jobs
     */
    public runningJobs: { list: Array<{ id, name, last_run_date, job_interval}>, total: number, isLoading: boolean, hasError?: boolean } = {
        list: [],
        total: 0,
        isLoading: false
    };

    constructor(private metadata: metadata,
                private toast: toast,
                private modal: modal,
                private language: language,
                public backend: backend) {
    }

    /**
     * reload the list of jobs
     */
    public ngOnInit() {
        this.reloadList();
    }

    /**
     * reload running jobs
     */
    public reloadList() {

        this.runningJobs.list = [];
        this.runningJobs.total = 0;
        this.runningJobs.hasError = false;

        const config = this.metadata.getComponentConfig('AdministrationJobRunningList', 'SchedulerJobs');

        if (!config.moduleFilter) {
            this.runningJobs.hasError = true;
            return console.error('Mssing module filter for component AdministrationJobRunningList');
        }

        this.runningJobs.isLoading = true;

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
                this.runningJobs.list = res.list;
                this.runningJobs.total = res.totalcount;
                this.runningJobs.isLoading = false;
            },
            error => {
                this.runningJobs.hasError = true;
                this.runningJobs.isLoading = false;
            }
        );
    }

    /**
     * reload running jobs
     */
    public loadMore() {

        if (this.runningJobs.isLoading || this.runningJobs.list.length >= this.runningJobs.total) {
            return false;
        }

        const config = this.metadata.getComponentConfig('AdministrationJobRunningList', 'SchedulerJobs');

        if (!config.moduleFilter) {
            this.runningJobs.hasError = true;
            return console.error('Mssing module filter for component AdministrationJobRunningList');
        }

        this.runningJobs.isLoading = true;

        const params = {
            modulefilter: config.moduleFilter,
            start: this.runningJobs.list.length,
            limit: 20
        };
        const sortArray = [{
            sortfield: 'last_run_date',
            sortdirection: 'DESC'
        }];

        this.backend.getList('SchedulerJobs', sortArray, params).subscribe(
            (res: any) => {
                this.runningJobs.list = res.list;
                this.runningJobs.total = res.totalcount;
                this.runningJobs.isLoading = false;
            },
            error => {
                this.runningJobs.hasError = true;
                this.runningJobs.isLoading = false;
            }
        );
    }

    /**
     * send kill request to the backend to kill the running process of the job
     */
    public killJob(job: { id, name, last_run_date, job_interval}) {

        this.modal.confirm('MSG_CONFIRM_KILL', this.language.getLabel('LBL_KILL')).subscribe(answer => {

            if (!answer) return;

            this.backend.postRequest(`module/SchedulerJobs/${job.id}/kill`).subscribe(res => {
                const label = !res ? 'ERR_FAILED_TO_EXECUTE' : 'MSG_SUCCESSFULLY_EXECUTED';
                const type = !res ? 'error' : 'success';
                if (!!res) {
                    this.reloadList();
                }
                this.toast.sendToast(this.language.getLabel(label), type);

            });
        });
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
