/**
 * @module AdminComponentsModule
 */
import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from "../../services/model.service";
import {backend} from "../../services/backend.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {broadcast} from "../../services/broadcast.service";
import {userpreferences} from "../../services/userpreferences.service";
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment;

@Component({
    selector: 'administration-job-log',
    templateUrl: './src/admincomponents/templates/administrationjoblog.html',
    providers: [relatedmodels]
})
export class AdministrationJobLog implements OnInit, OnDestroy {

    public jobLogs: any[] = [];
    private isLoading = false;
    private isReLoading = false;
    private subscription: Subscription = new Subscription();
    private totalLimit: number;
    private totalLines: number;

    constructor(public model: model,
                public language: language,
                public metadata: metadata,
                public broadcast: broadcast,
                public elementRef: ElementRef,
                public userpreferences: userpreferences,
                public backend: backend) {
        this.subscription = this.broadcast.message$.subscribe(res => {
            if (res.messagetype == 'scheduler.run') {
                this.reloadData();
            }
        });
    }

    public ngOnInit() {
        this.getData();
    }

    private getData() {
        let params = {
            offset: 0,
            limit: 10
        };
        this.totalLimit = 10;
        this.isLoading = true;
        this.backend.getRequest(`module/Jobs/${this.model.id}/joblog`, params)
            .subscribe(
                (response: any) => {
                    this.jobLogs = this.mapList(response.list);
                    this.sortList();
                    this.totalLines = response.count;
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    private getMoreData() {
        let params = {
            sort: {
                sortfield: 'execute_time',
                sortdirection: 'DESC'
            },
            offset: this.jobLogs.length,
            limit: 10,
            getcount: true
        };
        this.totalLimit += 10;
        this.isLoading = true;
        this.backend.getRequest(`module/Jobs/${this.model.id}/joblog`, params)
            .subscribe(
                (response: any) => {
                    this.jobLogs = [...this.jobLogs, ...this.mapList(response.list)];
                    this.sortList();
                    this.totalLines = response.count;
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    private reloadData() {
        if (this.isLoading) return;
        let params = {
            offset: 0,
            limit: this.totalLimit
        };
        this.isLoading = this.isReLoading = true;
        this.backend.getRequest(`module/Jobs/${this.model.id}/joblog`, params)
            .subscribe(
                (response: any) => {
                    this.jobLogs = this.mapList(response.list);
                    this.sortList();
                    this.totalLines = response.count;
                    this.isLoading = this.isReLoading = false;
                }, err => this.isLoading = this.isReLoading = false);
    }

    private mapList(list: any[]) {
        return list.map(i => {
            i.executed_on = moment(moment.utc(i.executed_on)).tz( this.userpreferences.toUse.timezone )
                .format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
            i.resolutionClass = `slds-text-color_${(i.resolution == 'failure' ? 'error' : i.resolution == 'success' ? 'success' : 'default')}`;
            return i;
        });
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private sortList() {
        this.jobLogs.sort( (a, b ) => a.executed_on < b.executed_on ? 1 : a.executed_on > b.executed_on ? -1 : 0 );
    }

}
