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
    templateUrl: './src/admincomponents/templates/administrationjoblog.html',
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
    public jobLogs: Array<{ id, name, schedulerjob_id, schedulerjobtask_id, message, rel_id, rel_module, resolution, executed_on, resolutionClass? }> = [];
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
     * total limit of the loaded entries
     * @private
     */
    private totalLimit: number = 10;
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

    /**
     * toggle expanding the card
     */
    private toggleExpand(e: MouseEvent) {
        e.stopPropagation();
        this.expanded = !this.expanded;
    }
}
