/**
 * @module ModuleHome
 */
import {
    AfterViewInit, Component, ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {userpreferences} from "../../../services/userpreferences.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'home-dashboard',
    templateUrl: '../templates/homedashboard.html',
})
export class HomeDashboard implements AfterViewInit, OnDestroy {

    @ViewChild('dashboardcontainer', {read: ViewContainerRef, static: true}) public dashboardcontainer: ViewContainerRef;

    public componentSubscriptions: any[] = [];
    public dashboardid: string = '';
    public dashboardcontainercomponent: any = undefined;

    constructor(
        public broadcast: broadcast,
        public metadata: metadata,
        public language: language,
        public userpreferences: userpreferences) {
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));

        this.loadDashboardConfig();
    }

    public handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.loadDashboardConfig();
                break;

        }
    }

    public loadDashboardConfig() {
        let homeDashboard = this.userpreferences.toUse.home_dashboard || undefined;
        let activeRole = this.metadata.getActiveRole();
        this.dashboardid = homeDashboard || activeRole.default_dashboard || '';

            // set it to the component
        if (this.dashboardcontainercomponent) {
            this.dashboardcontainercomponent.instance.dashboardid = this.dashboardid;
        }
    }

    public ngAfterViewInit() {
        this.metadata.addComponent('DashboardContainer', this.dashboardcontainer).subscribe(component => {
            component.instance.dashboardid = this.dashboardid;
            component.instance.context = 'Home';

            this.dashboardcontainercomponent = component;
        });
    }

    public ngOnDestroy() {
        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }
}
