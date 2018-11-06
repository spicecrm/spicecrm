import {
    Component,
    Input
} from '@angular/core';

import {Router}   from '@angular/router';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';


@Component({
    selector: 'dashboard-container-homeheader',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerhomeheader.html',
})
export class DashboardContainerHomeHeader  {

    @Input() private dashboardid: string = '';

    constructor(private dashboardlayout: dashboardlayout, private language: language, private router: Router) {
    }

    get dashboardname(){
        return this.dashboardlayout.model.getFieldValue('name');
    }

    private goDashboards(){
        this.router.navigate(['/module/Dashboards']);
    }
}