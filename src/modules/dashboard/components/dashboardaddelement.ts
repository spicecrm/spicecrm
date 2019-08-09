/**
 * @module ModuleDashboard
 */
import {Component, EventEmitter} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'dashboard-add-element',
    templateUrl: './src/modules/dashboard/templates/dashboardaddelement.html'
})
export class DashboardAddElement {

    public self: any = {};
    public kreports: any[] = [];
    private dashboarddashlets: any[] = [];
    private dashletName: string = '';
    private searchKey: string = '';
    private dashlettype: string = 'Generic';
    private dashletModule: string = '*';
    private isLoading: boolean = false;
    private canLoadMore: boolean = true;
    private loadLimit: number = 40;
    private addDashlet: EventEmitter<any> = new EventEmitter<any>();
    private searchTimeout: any;

    constructor(private language: language, private metadata: metadata, private backend: backend) {
    }

    get kReports() {
        return (this.dashletModule == '*') ? this.kreports : this.kreports
            .filter(report => report.report_module == this.dashletModule);
    }

    get dashboardDashlets() {
        return this.dashboarddashlets
            .filter(dashlet => (this.dashletModule == '*' || dashlet.module == this.dashletModule) &&
                (this.searchKey.length == 0 || this.language.getLabel(dashlet.label).toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1));
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

    get modules() {
        return this.metadata.getModules();
    }

    public ngOnInit() {
        this.getDashlets();
    }

    private resetValues() {
        this.dashletModule = '*';
        this.searchKey = '';
        this.canLoadMore = true;
    }

    private search() {
        if (this.dashletType !== 'Generic') {
            if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
            this.searchTimeout = window.setTimeout(() => this.getKReports(), 600);
        }
    }

    private trackByFn(index, item) {
        return index;
    }

    private getDashlets() {
        this.isLoading = true;
        this.dashboarddashlets = [];
        this.backend.getRequest('dashboards/dashlets')
            .subscribe((dashboardDashlets: any) => {
                this.dashboarddashlets = dashboardDashlets;
                this.isLoading = false;
            });
    }

    private getKReports() {
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

    private getMoreKReports() {
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

    private getIcon(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[1] : icon;
    }

    private getSprite(icon) {
        return (icon && icon.split(':')[1]) ? icon.split(':')[0] : 'standard';
    }

    private onScroll(scrollElement) {
        if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight) {
            this.getMoreKReports();
        }
    }

    private add(dashlet) {
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

    private close() {
        this.addDashlet.emit(false);
        this.self.destroy();
    }
}
