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
    private isLoading: boolean = false;
    private subscription: Subscription = new Subscription();

    constructor(public model: model,
                public language: language,
                public metadata: metadata,
                public broadcast: broadcast,
                public elementRef: ElementRef,
                public userpreferences: userpreferences,
                public backend: backend) {
        this.subscription = this.broadcast.message$.subscribe(res => {
            if (res.messagetype == 'scheduler.run') {
                this.getData();
            }
        });
    }

    ngOnInit() {
        this.getData();
    }

    public getData() {
        let params = {
            start: 0,
            limit: 10
        };
        this.isLoading = true;
        this.backend.getRequest("module/Schedulers/" + this.model.id + "/related/schedulers_times", params)
            .subscribe(
                (response: any) => {
                    this.schedulerLogs = _.values(response);
                    this.schedulerLogs.sort((a, b) => {
                        return a.execute_time > b.execute_time ? -1 : 0;
                    });
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    public getMoreData() {
        let params = {
            start: this.schedulerLogs.length,
            limit: 10
        };
        this.isLoading = true;
        this.backend.getRequest("module/Schedulers/" + this.model.id + "/related/schedulers_times", params)
            .subscribe(
                (response: any) => {
                    this.schedulerLogs = [...this.schedulerLogs, ..._.values(response)];
                    this.schedulerLogs.sort((a, b) => {
                        return a.execute_time > b.execute_time ? -1 : 0;
                    });
                    this.isLoading = false;
                }, err => this.isLoading = false);
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
        date = moment(date).tz(moment.tz.guess());
        date.add(date.utcOffset(), "m");
        return date.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
    }

    private trackByFn(index, item) {
        return item.id;
    }
}