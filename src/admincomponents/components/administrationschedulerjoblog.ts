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
declare var _;
/**
 * @ignore
 */
declare var moment;

@Component({
    selector: 'administration-scheduler-jobs-enum',
    templateUrl: './src/admincomponents/templates/administrationschedulerjoblog.html',
    providers: [relatedmodels]
})
export class AdministrationSchedulerJobLog implements OnInit, OnDestroy {

    public schedulerLogs: any[] = [];
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
            sort: {
                sortfield: 'execute_time',
                sortdirection: 'DESC'
            },
            offset: 0,
            limit: 10,
            getcount: true
        };
        this.totalLimit = 10;
        this.isLoading = true;
        this.backend.getRequest("module/Schedulers/" + this.model.id + "/related/schedulers_times", params)
            .subscribe(
                (response: any) => {
                    this.schedulerLogs = _.values(response.list);
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
            offset: this.schedulerLogs.length,
            limit: 10,
            getcount: true
        };
        this.totalLimit += 10;
        this.isLoading = true;
        this.backend.getRequest("module/Schedulers/" + this.model.id + "/related/schedulers_times", params)
            .subscribe(
                (response: any) => {
                    this.schedulerLogs = [...this.schedulerLogs, ..._.values(response.list)];
                    this.sortList();
                    this.totalLines = response.count;
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    private reloadData() {
        let params = {
            sort: {
                sortfield: 'execute_time',
                sortdirection: 'DESC'
            },
            offset: 0,
            limit: this.totalLimit,
            getcount: true
        };
        this.isLoading = this.isReLoading = true;
        this.backend.getRequest("module/Schedulers/" + this.model.id + "/related/schedulers_times", params)
            .subscribe(
                (response: any) => {
                    this.schedulerLogs = _.values(response.list);
                    this.sortList();
                    this.totalLines = response.count;
                    this.isLoading = this.isReLoading = false;
                }, err => this.isLoading = this.isReLoading = false);
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private getResolutionClass(status) {
        switch (status) {
            case 'failure':
                return 'slds-text-color_error';
            case 'success':
                return 'slds-text-color_success';
            default:
                return 'slds-text-color--default';
        }
    }

    private displayDateValue(date) {
        if (!date) {
            return '';
        }
        date = moment(date).tz( this.userpreferences.toUse.timezone );
        date.add(date.utcOffset(), "m");
        return date.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private sortList() {
        this.schedulerLogs.sort( ( a, b ) => a.execute_time < b.execute_time ? 1 : a.execute_time > b.execute_time ? -1 : 0 );
    }

}
