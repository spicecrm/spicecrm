import {Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'dashboard-generic-dashlet',
    templateUrl: './src/modules/dashboard/templates/dashboardgenericdashlet.html',
    providers: [model, view]
})
export class DashboardGenericDashlet implements OnInit {
    loading: boolean = true;
    records: Array<any> = [];
    recordcount: number = 0;
    dashletconfig: any = null;
    dashletModule: string = undefined;
    dashletLabel: string = undefined;
    dashletFields: Array<any> = [];
    dashletFieldSet: any = undefined;
    canLoadMore: boolean = true;
    loadLimit: number = 20;

    @ViewChild('tablecontainer', {read: ViewContainerRef}) tablecontainer: ViewContainerRef;
    @ViewChild('headercontainer', {read: ViewContainerRef}) headercontainer: ViewContainerRef;

    constructor(private language: language, private metadata: metadata, private backend: backend, private model: model, private elementRef: ElementRef) {

    }

    ngOnInit() {
        // set the module on the model
        this.model.module = this.dashletModule;

        // load the dashlet records
        this.loadRecords();
    }

    get dashletTitle(){
        return this.language.getLabel(this.dashletLabel);
    }

    loadRecords(){
        let params = this.params;
        if (this.dashletModule){
            this.backend.getRequest('module/' + this.dashletModule, params).subscribe((records: any) => {
                this.records = records.list;
                this.recordcount = +records.list.length;
                this.loading = false;
                if (records.list.length < this.loadLimit)
                    this.canLoadMore = false;
            });
        }
    }

    get params(){
        let fieldArray: Array<string> = [],
            params = {fields: fieldArray};

        if (this.dashletconfig) {
            if (this.dashletconfig.fieldset) {
                this.dashletFields = this.metadata.getFieldSetFields(this.dashletconfig.fieldset);
                for (let field of this.dashletFields)
                    fieldArray.push(field.field);
                this.dashletFieldSet = this.dashletconfig.fieldset;
            }
            if (this.dashletconfig.filters) {
                for (let filter in this.dashletconfig.filters)
                    params[filter] = this.dashletconfig.filters[filter];
            }
        }
        params['limit'] = this.loadLimit;

        return params;
    }
    get tablestyle(){
        let element = this.headercontainer.element.nativeElement;
        return {height: `calc(98% - ${element.clientHeight}px` }

    }

    onScroll() {
        let element = this.tablecontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight)
            this.loadMore();
    }

    loadMore(){
        if (this.canLoadMore){
            this.loading = true;
            let params = this.params;
            params['offset'] = this.records.length;
            this.backend.getRequest('module/' + this.dashletModule, params).subscribe((records: any) => {
                this.records = this.records.concat(records.list);
                this.recordcount += +records.list.length;
                if (records.list.length < this.loadLimit)
                    this.canLoadMore = false;
                this.loading = false;
            });
        }
    }


}