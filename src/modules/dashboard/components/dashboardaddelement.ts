/**
 * @module ModuleDashboard
 */
import {Component, EventEmitter} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'dashboard-add-element',
    templateUrl: '../templates/dashboardaddelement.html'
})
export class DashboardAddElement {

    public self: any = {};
    public kreports: any[] = [];
    public dashboarddashlets: any[] = [];
    public dashletName: string = '';
    public searchKey: string = '';
    public dashlettype: string = 'Generic';
    public dashletModule: string = '*';
    public isLoading: boolean = false;
    public canLoadMore: boolean = true;
    public loadLimit: number = 40;
    public addDashlet: EventEmitter<any> = new EventEmitter<any>();
    public searchTimeout: any;
    public modules = [];

    constructor(public language: language, public metadata: metadata, public backend: backend) {
    }

    get kReports() {
        return (this.dashletModule == '*') ? this.kreports : this.kreports
            .filter(report => report.report_module == this.dashletModule);
    }

    get dashboardDashlets() {
        return this.dashboarddashlets
            .filter(dashlet => (this.dashletModule == '*' || dashlet.module == this.dashletModule) &&
                (this.searchKey.length == 0 || this.language.getLabel(dashlet.label).toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1)
                && this.metadata.checkModuleAcl(dashlet.module, 'list'));
    }

    get dashletType() {
        return this.dashlettype;
    }

    set dashletType(value) {
        this.dashlettype = value;
        this.resetValues();
        if (value === 'Generic') {
            this.getDashlets();
        } else {
            this.getKReports();
        }
    }

    public ngOnInit() {
        this.getDashlets();
        this.modules = this.metadata.getModules().sort();
    }

    public resetValues() {
        this.dashletModule = '*';
        this.searchKey = '';
        this.canLoadMore = true;
    }

    public search() {
        if (this.dashletType !== 'Generic') {
            if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
            this.searchTimeout = window.setTimeout(() => this.getKReports(), 600);
        }
    }

    public trackByFn(index, item) {
        return index;
    }

    public getDashlets() {
        this.isLoading = true;
        this.dashboarddashlets = [];
        this.backend.getRequest('module/Dashboards/dashlets')
            .subscribe((dashboardDashlets: any) => {
                this.dashboarddashlets = dashboardDashlets;
                this.isLoading = false;
            });
    }

    public getKReports() {
        this.isLoading = true;
        this.kreports = [];
        let params = {
            offset: 0,
            limit: this.loadLimit,
            searchKey: this.searchKey
        };
        this.backend.getRequest('module/KReports/published/' + this.dashletType, params)
            .subscribe((kreports: any) => {
                this.kreports = kreports;
                this.isLoading = false;
            });
    }

    public getMoreKReports() {
        if (!this.canLoadMore || this.isLoading) return;
        this.isLoading = true;
        let params = {
            offset: this.kReports.length,
            limit: this.loadLimit
        };
        this.backend.getRequest('module/KReports/published/' + this.dashletType, params)
            .subscribe((kreports: any) => {
                this.kreports = this.kReports.concat(kreports);
                this.canLoadMore = kreports.length == this.loadLimit;
                this.isLoading = false;
            });
    }

    public getIcon(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[1] : icon;
    }

    public getSprite(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[0] : 'standard';
    }

    public onScroll(scrollElement) {
        if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight) {
            this.getMoreKReports();
        }
    }

    public add(dashlet) {
        if (!dashlet) return;
        let name = this.dashletName;
        let component = '';
        let componentconfig: any = {};
        let dashletconfig: any = {};
        let module: string = '';
        let icon: string = '';
        let acl_action: string = '';
        let dashlet_id: string = '';
        let label: string = '';

        switch (this.dashletType) {
            case 'dashletVisualization':
                component = 'ReporterVisualizationDashlet';
                componentconfig = {reportid: dashlet.id};
                module = 'KReports';
                break;
            case 'dashletPresentation':
                component = 'ReporterPresentationDashlet';
                componentconfig = {reportid: dashlet.id};
                module = 'KReports';
                break;
            case 'Generic':
                component = dashlet.component;
                dashlet_id = dashlet.id;
                dashletconfig = dashlet.componentconfig ? JSON.parse(dashlet.componentconfig) : '';
                module = dashlet.module;
                label = dashlet.label;
                icon = dashlet.icon;
                acl_action = dashlet.acl_action;
                break;
        }

        this.addDashlet.emit({
            name,
            label,
            module,
            component,
            componentconfig,
            dashletconfig,
            icon,
            acl_action,
            dashlet_id
        });

        this.self.destroy();
    }

    public close() {
        this.addDashlet.emit(false);
        this.self.destroy();
    }
}
