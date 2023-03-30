/**
 * @module ModuleDashboard
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {dashboardlayout} from '../services/dashboardlayout.service';
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'dashboard-view',
    templateUrl: '../templates/dashboardview.html',
    providers: [model, modellist, dashboardlayout, view]
})
export class DashboardView implements OnInit {

    public panelwidth = 250;
    public showpanel: boolean = false;

    constructor(public navigationTab: navigationtab,
                public language: language,
                public dashboardlayout: dashboardlayout,
                public userpreferences: userpreferences,
                public model: model,
                public view: view,
                public modellist: modellist,
                public metadata: metadata) {
    }

    get ismobile() {
        return window.innerWidth < 1024;
    }

    get dashboardstyle() {
        return {
            width: 'calc(100% - ' + (this.ismobile ? 0 : this.panelwidth) + 'px)'
        };
    }

    get panelstyle() {
        return {
            'width': this.panelwidth + 'px',
            'z-index': 1,
            'left': this.ismobile && !this.showpanel ? '-250px' : '0px'
        };
    }

    public ngOnInit() {
        this.loadDashboards();
        this.navigationTab.setTabInfo({displaymodule: 'Dashboards', displayname: this.metadata.getModuleDefs('Dashboards').module_label});
    }

    public loadDashboards() {
        // load for the selector
        let lastDashboardId = this.userpreferences.getPreference('last_dashboard');
        this.model.module = 'Dashboards';
        this.modellist.initialize('Dashboards');
        // ToDo: add infinite scrolling and reload on change of searchterm
        this.modellist.loadlimit = 250;
        this.modellist.getListData()
            .subscribe(() => {
                if (lastDashboardId) {
                    this.modellist.listData.list.some(dashboard => {
                        if (dashboard.id == lastDashboardId) {
                            this.loadDashboard(lastDashboardId);
                            return true;
                        }
                    });
                }
            });
    }

    public loadDashboard(id) {
        if (id != this.dashboardlayout.dashboardId) {
            this.view.setViewMode();
            this.dashboardlayout.dashboardId = id;
            this.model.id = id;
            this.dashboardlayout.dashboardElements = [];
            this.dashboardlayout.dashboardNotFound = false;

            this.model.getData().subscribe(() => {
                this.dashboardlayout.dashboardElements = this.model.getField('components');

                // sort the elements for the compact view
                this.dashboardlayout.sortElements();

                }, err => {if (err.status == 404) this.dashboardlayout.dashboardNotFound = true;});
        }
    }
}
