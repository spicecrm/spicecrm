/**
 * @module ModuleDashboard
 */
import {
    Component,
    Input
} from '@angular/core';

import {Router}   from '@angular/router';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';


@Component({
    selector: 'dashboard-container-homeheader',
    templateUrl: '../templates/dashboardcontainerhomeheader.html',
})
export class DashboardContainerHomeHeader  {

    @Input() public dashboardid: string = '';

    constructor(public dashboardlayout: dashboardlayout, public language: language, public router: Router) {
    }

    get dashboardname(){
        return this.dashboardlayout.model.getFieldValue('name');
    }

    public goDashboards(){
        this.router.navigate(['/module/Dashboards']);
    }
}
