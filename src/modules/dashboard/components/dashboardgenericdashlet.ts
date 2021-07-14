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
 * @module ModuleDashboard
 */
import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {broadcast} from "../../../services/broadcast.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";

@Component({
    selector: "dashboard-generic-dashlet",
    templateUrl: "./src/modules/dashboard/templates/dashboardgenericdashlet.html",
    providers: [model, view]
})
export class DashboardGenericDashlet implements OnInit, OnDestroy {
    private loading: boolean = true;
    private records: any[] = [];
    private recordcount: number = 0;
    private recordtotal: number = 0;
    private dashletconfig: any = null;
    private dashletModule: string = undefined;
    private dashletLabel: string = undefined;
    private dashletFields: any[] = [];
    private dashletFieldSet: any = undefined;
    private loadLimit: number = 50;

    private subscriptions: Subscription = new Subscription();

    @ViewChild("tablecontainer", {read: ViewContainerRef, static: true}) private tablecontainer: ViewContainerRef;
    @ViewChild("headercontainer", {read: ViewContainerRef, static: true}) private headercontainer: ViewContainerRef;

    private sortparams: any = {
        sortdirection: '',
        sortfield: ''
    };

    constructor(private language: language, private metadata: metadata, private backend: backend, private model: model, private broadcast: broadcast, private elementRef: ElementRef) {
// subscribe to the broadcast service
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    get canLoadMore() {
        return this.recordtotal > this.records.length;
    }

    get dashletTitle() {
        return this.language.getLabel(this.dashletLabel);
    }

    get islarge() {
        return window.innerWidth > 768;
    }

    get tableContainerStyle() {
        return {
            height: `calc(100% - ${this.headercontainer.element.nativeElement.getBoundingClientRect().height}px)`
        };
    }

    get params() {
        let params: any = {};

        if (this.dashletconfig) {
            if (this.dashletconfig.fieldset) {
                this.dashletFields = this.metadata.getFieldSetFields(this.dashletconfig.fieldset);
                this.dashletFieldSet = this.dashletconfig.fieldset;
            }
            if (this.dashletconfig.filters) {
                for (let filter in this.dashletconfig.filters) {
                    if (this.dashletconfig.filters.hasOwnProperty(filter)) {
                        params[filter] = this.dashletconfig.filters[filter];
                    }
                }
            }
            if (this.dashletconfig.modulefilter) {
                params.modulefilter = this.dashletconfig.modulefilter;
            }
            // params.sortfield = this.sortparams.sortfield ? this.sortparams.sortfield : this.dashletconfig.sortfield;
            // params.sortdirection = this.sortparams.sortdirection ? this.sortparams.sortdirection : (this.dashletconfig.sortdirection ? this.dashletconfig.sortdirection : 'ASC');
            params.sortfields = [{ sortfield:params.sortfield, sortdirection:params.sortdirection }];
        }
        params.limit = this.loadLimit;

        return params;
    }

    get tablestyle() {
        let element = this.headercontainer.element.nativeElement;
        return {height: `calc(98% - ${element.clientHeight}px`};

    }

    public ngOnInit() {
        // set the module on the model
        this.model.module = this.dashletModule;
        this.loadLimit = (this.dashletconfig && this.dashletconfig.limit) ? this.dashletconfig.limit : this.loadLimit;

        // load the dashlet records
        this.loadRecords();
    }

    /**
     * unsubscribe from any subnscriptions we might have
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadRecords() {
        let params = this.params;
        if (this.dashletModule) {
            this.backend.getRequest("module/" + this.dashletModule, params)
                .subscribe((records: any) => {
                    this.records = records.list;
                    this.recordcount = +records.list.length;
                    this.recordtotal = records.totalcount;
                    this.loading = false;
                });
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private onScroll() {
        let element = this.tablecontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5) {
            this.loadMore();
        }
    }

    private loadMore() {
        if (this.canLoadMore && !this.loading) {
            this.loading = true;
            let params: any = this.params;
            params.offset = this.records.length;
            this.backend.getRequest("module/" + this.dashletModule, params)
                .subscribe((records: any) => {
                    this.records = this.records.concat(records.list);
                    this.recordcount += +records.list.length;
                    this.loading = false;
                });
        }
    }

    /**
     * handles model updates
     *
     * @param message
     */
    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.dashletModule) {
            return;
        }

        switch (message.messagetype) {
            case 'model.delete':
                let deletedItemIndex = this.records.findIndex(item => item.id == message.messagedata.id);
                if (deletedItemIndex >= 0) {
                    this.records.splice(deletedItemIndex, 1);
                    this.recordcount--;
                    this.recordtotal--;
                }
                break;
            case 'model.save':
                let eventHandled = false;
                let savedItemIndex = this.records.findIndex(item => item.id == message.messagedata.id);
                if (savedItemIndex >= 0) {
                    this.records = [];
                    this.loadRecords();
                }
                break;
        }
    }

    /**
     * returns if a given fielsd is set sortable in teh fieldconfig
     *
     * @param field the field from the fieldset
     */
    private isSortable(field): boolean {
        if (field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * a helper function to determine the sort icon based on the set sort criteria
     */
    private getSortIcon(): string {
        if (this.sortparams.sortdirection === 'ASC') {
            return 'arrowdown';
        } else {
            return 'arrowup';
        }
    }

    /**
     * sets the field as sort parameter
     *
     * @param field the field from the fieldset
     */
    private setSortField(field): void {
        if (this.isSortable(field)) {
            if (this.sortparams.sortfield == field.field) {
                this.sortparams.sortdirection = this.sortparams.sortdirection == 'ASC' ? 'DESC' : 'ASC';
            } else {
                this.sortparams.sortfield = field.field;
                this.sortparams.sortdirection = 'ASC';
            }

            // reload the records
            this.loadRecords();
        }
    }

}
