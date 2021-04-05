/*
SpiceUI 2021.01.001

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
    private modules = [];

    constructor(private language: language, private metadata: metadata, private backend: backend) {
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
