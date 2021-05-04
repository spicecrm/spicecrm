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
