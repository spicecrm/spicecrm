/**
 * @module ModuleDashboard
 */
import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    EventEmitter,
    Injector,
    Output,
    ReflectiveInjector, ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {dashboardlayout} from '../services/dashboardlayout.service';

@Component({
    selector: 'dashboard-select-panel',
    templateUrl: '../templates/dashboardselectpanel.html',
    providers: [model]
})
export class DashboardSelectPanel {

    public dashboardFilter: string = '';
    @Output() public hide: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public dashboardSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public vcr: ViewContainerRef,public metadata: metadata, public userpreferences: userpreferences, public language: language, public model: model, public modellist: modellist, public dashboardlayout: dashboardlayout, public cfr: ComponentFactoryResolver) {

    }

    get dashboards(): any[] {
        let dashboards: any[] = [];
        for (let dashboard of this.modellist.listData.list) {
            if (dashboard.id == this.dashboardlayout.dashboardId || this.dashboardFilter == '' || (this.dashboardFilter != '' && dashboard.name.toLowerCase().indexOf(this.dashboardFilter.toLowerCase()) != -1)) {
                dashboards.push(dashboard);
            }
        }
        return dashboards;
    }

    get canAdd() {
        return this.metadata.checkModuleAcl('Dashboards', 'create');
    }

    public getActiveClass(id) {
        return id == this.dashboardlayout.dashboardId ? 'slds-is-active' : '';
    }

    public setDashboard(dashboard) {
        // save the preference
        this.userpreferences.setPreference('last_dashboard', dashboard.id);
        this.dashboardSelect.emit(dashboard.id);
        this.hidepanel();
    }

    public hidepanel() {
        this.hide.emit(true);
    }

    public trackByFn(index, item) {
        return item.id;
    }
}
