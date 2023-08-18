/**
 * @module ModuleDashboard
 */
import {
    Component,
    EventEmitter,
    Output,
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {dashboardlayout} from '../services/dashboardlayout.service';

@Component({
    selector: 'dashboard-select-panel-add-button',
    templateUrl: '../templates/dashboardselectpaneladdbutton.html',
    providers: [model]
})
export class DashboardSelectPanelAddButton {
    /**
     * emit when the dashboard is added to apply the necessary changes from parent
     * @private
     */
    @Output() public dashboardAdded = new EventEmitter<{id: string}>();

    constructor(public model: model, public modellist: modellist, public dashboardlayout: dashboardlayout) {
        this.model.module = 'Dashboards';
    }

    /**
     * add open add modal
     * @private
     */
    public addDashboard() {
        this.model.reset();
        this.model.module = 'Dashboards';
        this.model.addModel().subscribe(res => {
            if (!res) return;
            this.modellist.listData.list.push(res);
            this.dashboardAdded.emit({id: res.id});
        });
    }
}
