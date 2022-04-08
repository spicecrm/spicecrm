/**
 * @module ModuleDashboard
 */
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';
import {Router} from "@angular/router";
import {view} from "../../../services/view.service";

@Component({
    selector: 'dashboard-container',
    templateUrl: '../templates/dashboardcontainer.html',
    providers: [model, view, dashboardlayout]
})
export class DashboardContainer implements OnChanges {

    @Input() public dashboardid: string = '';
    @Input() public context: string = 'Dashboard';

    constructor(public dashboardlayout: dashboardlayout, public language: language, public router: Router, public model: model) {
    }

    public loadDashboard() {
        if (this.dashboardid != this.dashboardlayout.dashboardId) {
            this.model.initialize();
            this.model.module = 'Dashboards';
            this.dashboardlayout.dashboardId = this.dashboardid;
            this.model.id = this.dashboardid;

            this.dashboardlayout.dashboardElements = [];
            this.dashboardlayout.dashboardNotFound = false;

            this.model.getData(false)
                .subscribe(() => {
                    this.dashboardlayout.dashboardElements = this.model.getField('components');

                    // sort the elements for the compact view
                    this.dashboardlayout.sortElements();

                }, err => {if (err.status == 404) this.dashboardlayout.dashboardNotFound = true;});
        }
    }

    public ngOnInit() {
        this.loadDashboard();
    }

    public ngOnChanges() {
        this.loadDashboard();
    }

    public navigate() {
        this.router.navigate(['/module/Dashboards']);
    }
}
