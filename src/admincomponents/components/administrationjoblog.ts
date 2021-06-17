/**
 * @module AdminComponentsModule
 */
import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from "../../services/model.service";
import {backend} from "../../services/backend.service";
import {broadcast} from "../../services/broadcast.service";
import {userpreferences} from "../../services/userpreferences.service";
import {Subscription} from "rxjs";
import {modal} from "../../services/modal.service";

/**
 * @ignore
 */
declare var moment;

/**
 * renders a list of job log
 */
@Component({
    selector: 'administration-job-log',
    templateUrl: './src/admincomponents/templates/administrationjoblog.html'
})
export class AdministrationJobLog implements OnInit, OnDestroy {

    /**
     * holds the job log entries
     */
    public jobLogs: Array<{ id, name, job_id, jobtask_id, message, rel_id, rel_module, resolution, executed_on, resolutionClass? }> = [];
    /**
     * ture if we are loading from backend
     * @private
     */
    private isLoading = false;
    /**
     * true if we are reloading the entries from backend
     * @private
     */
    private isReloading = false;
    /**
     * holds a subscription to enable unsubscribe
     * @private
     */
    private subscription: Subscription = new Subscription();
    /**
     * total limit of the loaded entires
     * @private
     */
    private totalLimit: number = 10;
    /**
     * total count of the log entries
     * @private
     */
    private totalLines: number;

    constructor(public model: model,
                public language: language,
                public metadata: metadata,
                public broadcast: broadcast,
                public elementRef: ElementRef,
                public modal: modal,
                public userpreferences: userpreferences,
                public backend: backend) {
    }

    /**
     * load the log entries
     */
    public ngOnInit() {
        this.getData();
        this.subscribeToJobActions();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
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

    /**
     * subscribe to job actions to reload the list
     * @private
     */
    private subscribeToJobActions() {
        this.subscription = this.broadcast.message$.subscribe(res => {
            if (res.messagetype == 'job.run') {
                this.reloadData();
            }
        });
    }

    /**
     * load the log entries from backend
     * @private
     */
    private getData() {
        let params = {
            offset: 0,
            limit: 10
        };
        this.totalLimit = 10;
        this.isLoading = true;
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/log`, params)
            .subscribe(
                (response: any) => {
                    this.jobLogs = this.mapList(response.list);
                    this.sortList();
                    this.totalLines = response.count;
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    /**
     * get more log entries
     * @private
     */
    private getMoreData() {
        let params = {
            sort: {
                sortfield: 'executed_on',
                sortdirection: 'DESC'
            },
            offset: this.jobLogs.length,
            limit: 10,
            getcount: true
        };
        this.totalLimit += 10;
        this.isLoading = true;
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/log`, params)
            .subscribe(
                (response: any) => {
                    this.jobLogs = [...this.jobLogs, ...this.mapList(response.list)];
                    this.sortList();
                    this.totalLines = response.count;
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    /**
     * reload the log entries
     * @private
     */
    private reloadData() {
        if (this.isLoading) return;
        let params = {
            offset: 0,
            limit: this.totalLimit
        };
        this.isLoading = this.isReloading = true;
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/log`, params)
            .subscribe(
                (response: any) => {
                    this.jobLogs = this.mapList(response.list);
                    this.sortList();
                    this.totalLines = response.count;
                    this.isLoading = this.isReloading = false;
                }, err => this.isLoading = this.isReloading = false);
    }

    /**
     * map the log list
     * @param list
     * @private
     */
    private mapList(list: any[]) {
        return list.map(i => {
            i.executed_on = moment(moment.utc(i.executed_on)).tz(this.userpreferences.toUse.timezone)
                .format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
            i.resolutionClass = `slds-text-color_${(i.resolution == 'failed' ? 'error' : 'success')}`;
            return i;
        });
    }

    /**
     * sort the list by the execution date
     * @private
     */
    private sortList() {
        this.jobLogs.sort((a, b) => a.executed_on < b.executed_on ? 1 : a.executed_on > b.executed_on ? -1 : 0);
    }
}
