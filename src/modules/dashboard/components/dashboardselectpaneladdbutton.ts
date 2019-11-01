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

    constructor(private model: model) {
        this.model.module = 'Dashboards';
    }

    private addDashboard() {
        this.model.addModel();
    }
}
