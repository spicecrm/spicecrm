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
    templateUrl: '../templates/administrationjobrunninglist.html'
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

    constructor(public metadata: metadata,
                public toast: toast,
                public modal: modal,
                public language: language,
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
    public trackByFn(index, item) {
        return item.id;
    }
}
