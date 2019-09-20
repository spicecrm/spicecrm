/**
 * @module ModuleDashboard
 */
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';
import {Router} from "@angular/router";

@Component({
    selector: 'dashboard-container',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainer.html',
    providers: [model, dashboardlayout]
})
export class DashboardContainer implements OnChanges, OnInit {

    @Input() private dashboardid: string = '';
    @Input() private context: string = 'Dashboard';

    constructor(private dashboardlayout: dashboardlayout, private language: language, private router: Router) {
    }

    public ngOnInit(): void {
        this.dashboardlayout.loadDashboard(this.dashboardid);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.dashboardlayout.loadDashboard(this.dashboardid);
    }

    private navigate() {
        this.router.navigate(['/module/Dashboards']);
    }
}
