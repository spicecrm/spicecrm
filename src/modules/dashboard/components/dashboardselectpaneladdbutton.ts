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
    selector: 'dashboard-select-panel-add-button',
    templateUrl: './src/modules/dashboard/templates/dashboardselectpaneladdbutton.html',
    providers: [model]
})
export class DashboardSelectPanelAddButton {
    /**
     * emit when the dashboard is added to apply the necessary changes from parent
     * @private
     */
    @Output() private dashboardAdded = new EventEmitter<{id: string}>();

    constructor(private model: model, private modellist: modellist, private dashboardlayout: dashboardlayout) {
        this.model.module = 'Dashboards';
    }

    /**
     * add open add modal
     * @private
     */
    private addDashboard() {
        this.model.reset();
        this.model.module = 'Dashboards';
        this.model.addModel().subscribe(res => {
            if (!res) return;
            this.modellist.listData.list.push(res);
            this.dashboardAdded.emit({id: res.id});
        });
    }
}
