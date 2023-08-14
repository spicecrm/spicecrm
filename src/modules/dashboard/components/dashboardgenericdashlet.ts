/**
 * @module ModuleDashboard
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {broadcast} from "../../../services/broadcast.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";
import {layout} from "../../../services/layout.service";

@Component({
    selector: "dashboard-generic-dashlet",
    templateUrl: "../templates/dashboardgenericdashlet.html",
    providers: [model, view]
})
export class DashboardGenericDashlet implements OnInit, OnDestroy {
    /**
     * holds the fieldset items
     */
    public dashletFields: any[] = [];
    /**
     * true while the backend is retrieving the records
     */
    public loading: boolean = true;
    /**
     * true if the backend returns an error
     */
    public failedToLoad: boolean = false;
    /**
     * a list of the module records
     */
    public records: any[] = [];
    /**
     * the count of the loaded records
     */
    public recordCount: number = 0;
    /**
     * the total count of the module records
     */
    public recordTotal: number = 0;
    /**
     * the module name
     * @private
     */
    public dashletModule: string;
    /**
     * a label to be displayed in the title
     */
    public dashletLabel: string;
    /**
     * the dashlet fieldset
     */
    public dashletFieldSet: any;
    /**
     * object of the sort direction and the sort field
     */
    public sortparams = {
        sortdirection: '',
        sortfield: ''
    };
    /**
     * the dashlet config passed from the parent component
     * @private
     */
    public dashletconfig: any = null;
    /**
     * saved subscriptions to help unsubscribe on destroy
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public language: language,
                public metadata: metadata,
                public backend: backend,
                public model: model,
                public layout: layout,
                public broadcast: broadcast) {

    }

    /**
     * subscribe to broadcast
     * set initial values
     * load the module records
     */
    public ngOnInit() {
        this.subscribeToBroadcast();
        this.setInitialValues();
        this.loadRecords();
    }

    /**
     * unsubscribe from any subscription we might have
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * handle scrolling to load more
     * @private
     */
    public onScroll(tableContainer: HTMLElement) {
        if (tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 5) {
            this.loadMore();
        }
    }

    /**
     * Angular function to cache the loaded list items in the dom
     * @param index
     * @param item
     * @return item.id
     * @private
     */
    public trackByFn(index: number, item): string {
        return item.id;
    }

    /**
     * subscribe to broadcast message to handle updating the list
     * @private
     */
    public subscribeToBroadcast() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => {

                // only handle if the module is the list module
                if (message.messagedata.module !== this.dashletModule) {
                    return;
                }

                switch (message.messagetype) {
                    case 'model.delete':
                        const deletedItemIndex = this.records.findIndex(item => item.id == message.messagedata.id);
                        if (deletedItemIndex >= 0) {
                            this.records.splice(deletedItemIndex, 1);
                            this.recordCount--;
                            this.recordTotal--;
                        }
                        break;
                    case 'model.save':
                        const savedItemIndex = this.records.findIndex(item => item.id == message.messagedata.id);
                        if (savedItemIndex >= 0) {
                            this.records = [];
                            this.loadRecords();
                        }
                        break;
                }
            })
        );
    }

    /**
     * set the module, the load limit and the sort params
     * @private
     */
    public setInitialValues() {

        this.model.module = this.dashletModule;
        this.sortparams.sortfield = this.dashletconfig.sortfield;
        this.sortparams.sortdirection = this.dashletconfig.sortdirection;

        if (this.dashletconfig.fieldset) {
            this.dashletFields = this.metadata.getFieldSetFields(this.dashletconfig.fieldset);
            this.dashletFieldSet = this.dashletconfig.fieldset;
        }
    }

    /**
     * get the records list from backend
     * @private
     */
    public loadRecords() {

        this.records = [];

        this.loading = true;

        const params = {
            limit: isNaN(this.dashletconfig?.limit) ? 50 : this.dashletconfig.limit,
            resolvelinks: isNaN(this.dashletconfig?.resolvelinks) ? false : this.dashletconfig.resolvelinks,
            modulefilter: this.dashletconfig.modulefilter,
            sortfields: [{
                sortfield: this.sortparams.sortfield,
                sortdirection: this.sortparams.sortdirection
            }]
        };

        if (this.dashletModule) {
            this.backend.getRequest("module/" + this.dashletModule, params)
                .subscribe(
                    (records: any) => {
                        this.records = records.list;
                        this.recordCount = +records.list.length;
                        this.recordTotal = records.totalcount;
                        this.loading = false;
                        this.failedToLoad = false;
                    },
                    () => {
                        this.loading = false;
                        this.failedToLoad = true;
                    }
                );
        }
    }

    /**
     * load more records
     * @private
     */
    public loadMore() {

        const canLoadMore = this.recordTotal > this.records.length;

        if (!canLoadMore || this.loading) return;

        this.loading = true;

        const params = {
            limit: isNaN(this.dashletconfig?.limit) ? 50 : this.dashletconfig.limit,
            resolvelinks: isNaN(this.dashletconfig?.resolvelinks) ? false : this.dashletconfig.resolvelinks,
            offset: this.records.length,
            modulefilter: this.dashletconfig?.modulefilter,
            sortfields: [{
                sortfield: this.sortparams.sortfield,
                sortdirection: this.sortparams.sortdirection
            }]
        };

        this.backend.getRequest("module/" + this.dashletModule, params)
            .subscribe(
                (records: any) => {
                    this.records = this.records.concat(records.list);
                    this.recordCount += +records.list.length;
                    this.loading = false;
                    this.failedToLoad = false;
                },
                () => {
                    this.loading = false;
                    this.failedToLoad = true;
                }
            );
    }

    /**
     * true if a given field is set sortable in the fieldconfig
     * @return boolean
     * @param field the field from the fieldset
     */
    public isSortable(field: { fieldconfig: { sortable: boolean } }): boolean {
        return field.fieldconfig?.sortable === true;
    }

    /**
     * sets the field as sort parameter
     * @param field the field from the fieldset
     */
    public setSortField(field: { field: string, fieldconfig: { sortable: boolean } }) {

        if (!this.isSortable(field)) return;

        if (!this.sortparams.sortfield || this.sortparams.sortfield != field.field) {
            this.sortparams.sortfield = field.field;
            this.sortparams.sortdirection = 'ASC';
        } else if (this.sortparams.sortdirection == 'ASC') {
            this.sortparams.sortdirection = 'DESC';
        } else {
            this.sortparams.sortfield = '';
            this.sortparams.sortdirection = '';
        }

        // reload the records
        this.loadRecords();
    }
}
