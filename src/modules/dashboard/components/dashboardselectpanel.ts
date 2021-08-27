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
    templateUrl: './src/modules/dashboard/templates/dashboardselectpanel.html',
    providers: [model]
})
export class DashboardSelectPanel {

    private dashboardFilter: string = '';
    @Output() private hide: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() private dashboardSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private vcr: ViewContainerRef,private metadata: metadata, private userpreferences: userpreferences, private language: language, private model: model, private modellist: modellist, private dashboardlayout: dashboardlayout, private cfr: ComponentFactoryResolver) {

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

    private getActiveClass(id) {
        return id == this.dashboardlayout.dashboardId ? 'slds-is-active' : '';
    }

    private setDashboard(dashboard) {
        // save the preference
        this.userpreferences.setPreference('last_dashboard', dashboard.id);
        this.dashboardSelect.emit(dashboard.id);
        this.hidepanel();
    }

    private hidepanel() {
        this.hide.emit(true);
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
