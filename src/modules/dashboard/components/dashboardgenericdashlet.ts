/**
 * @module ModuleDashboard
 */
import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: "dashboard-generic-dashlet",
    templateUrl: "./src/modules/dashboard/templates/dashboardgenericdashlet.html",
    providers: [model, view]
})
export class DashboardGenericDashlet implements OnInit {
    private loading: boolean = true;
    private records: any[] = [];
    private recordcount: number = 0;
    private dashletconfig: any = null;
    private dashletModule: string = undefined;
    private dashletLabel: string = undefined;
    private dashletFields: any[] = [];
    private dashletFieldSet: any = undefined;
    private canLoadMore: boolean = true;
    private loadLimit: number = 20;

    @ViewChild("tablecontainer", {read: ViewContainerRef}) private tablecontainer: ViewContainerRef;
    @ViewChild("headercontainer", {read: ViewContainerRef}) private headercontainer: ViewContainerRef;

    constructor(private language: language, private metadata: metadata, private backend: backend, private model: model, private elementRef: ElementRef) {

    }

    get dashletTitle() {
        return this.language.getLabel(this.dashletLabel);
    }

    get islarge() {
        return window.innerWidth > 768;
    }

    get tableContainerStyle() {
        return {
            width: '100%',
            height: `calc(100% - ${this.headercontainer.element.nativeElement.getBoundingClientRect().height}px)`
        };
    }

    get params() {
        let fieldArray: string[] = [];
        let params: any = {fields: fieldArray};

        if (this.dashletconfig) {
            if (this.dashletconfig.fieldset) {
                this.dashletFields = this.metadata.getFieldSetFields(this.dashletconfig.fieldset);
                for (let field of this.dashletFields) {
                    fieldArray.push(field.field);
                }
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
        this.loadLimit = (this.dashletconfig && this.dashletconfig.limit) ?  this.dashletconfig.limit : this.loadLimit;

        // load the dashlet records
        this.loadRecords();
    }

    private loadRecords() {
        let params = this.params;
        if (this.dashletModule) {
            this.backend.getRequest("module/" + this.dashletModule, params)
                .subscribe((records: any) => {
                    this.records = records.list;
                    this.recordcount = +records.list.length;
                    this.loading = false;
                    if (records.list.length < this.loadLimit) {
                        this.canLoadMore = false;
                    }
                });
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private onScroll() {
        let element = this.tablecontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
            this.loadMore();
        }
    }

    private loadMore() {
        if (this.canLoadMore) {
            this.loading = true;
            let params: any = this.params;
            params.offset = this.records.length;
            this.backend.getRequest("module/" + this.dashletModule, params)
                .subscribe((records: any) => {
                    this.records = this.records.concat(records.list);
                    this.recordcount += +records.list.length;
                    if (records.list.length < this.loadLimit) {
                        this.canLoadMore = false;
                    }
                    this.loading = false;
                });
        }
    }
}
