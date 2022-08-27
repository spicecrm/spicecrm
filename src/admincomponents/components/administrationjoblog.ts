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
import {animate, state, style, transition, trigger} from "@angular/animations";

/**
 * @ignore
 */
declare var moment;

/**
 * renders a list of job log
 */
@Component({
    selector: 'administration-job-log',
    templateUrl: '../templates/administrationjoblog.html',
    animations: [
        trigger('animateicon', [
            state('open', style({ transform: 'scale(1, 1)'})),
            state('closed', style({ transform: 'scale(1, -1)'})),
            transition('open => closed', [
                animate('.5s'),
            ]),
            transition('closed => open', [
                animate('.5s'),
            ])
        ]),
        trigger('displaycard', [
            transition(':enter', [
                style({opacity: 0, height: '0px', overflow: 'hidden'}),
                animate('.5s', style({height: '*', opacity: 1})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({height: '0px', opacity: 0}))
            ])
        ])
    ]
})
export class AdministrationJobLog implements OnInit, OnDestroy {

    /**
     * holds the job log entries
     */
    public jobLogs: { id, name, schedulerjob_id, schedulerjobtask_id, message, rel_id, rel_module, resolution: 'failed' | 'done', executed_on, resolutionClass? }[] = [];
    /**
     * ture if we are loading from backend
     * @private
     */
    public isLoading = false;
    /**
     * true if we are reloading the entries from backend
     * @private
     */
    public isReloading = false;
    /**
     * holds a subscription to enable unsubscribe
     * @private
     */
    public subscription: Subscription = new Subscription();
    /**
     * total limit of the loaded entries
     * @private
     */
    public totalLimit: number = 10;
    /**
     * total count of the log entries
     */
    public totalLines: number;
    /**
     * holds card expansion boolean
     */
    public expanded: boolean = true;

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
    public openMessageInModal(text: string, resolution: any) {
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
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * subscribe to job actions to reload the list
     * @private
     */
    public subscribeToJobActions() {
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
    public getData() {
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
                    this.totalLines = response.count;
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    /**
     * get more log entries
     * @private
     */
    public getMoreData() {
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
                    this.totalLines = response.count;
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    /**
     * reload the log entries
     * @private
     */
    public reloadData() {

        if (this.isLoading) return;
        this.jobLogs = [];

        let params = {
            offset: 0,
            limit: this.totalLimit
        };
        this.isLoading = this.isReloading = true;
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/log`, params)
            .subscribe(
                (response: any) => {
                    this.jobLogs = this.mapList(response.list);
                    this.totalLines = response.count;
                    this.isLoading = this.isReloading = false;
                }, err => this.isLoading = this.isReloading = false);
    }

    /**
     * map the log list
     * @param list
     * @private
     */
    public mapList(list: any[]) {
        return list.map(i => {
            i.executed_on = moment(moment.utc(i.executed_on)).tz(this.userpreferences.toUse.timezone)
                .format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
            i.resolutionClass = `slds-text-color_${(i.resolution == 'failed' ? 'error' : 'success')}`;
            return i;
        });
    }

    /**
     * toggle expanding the card
     */
    public toggleExpand(e: MouseEvent) {
        e.stopPropagation();
        this.expanded = !this.expanded;
    }
}
