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
    templateUrl: './src/modules/home/templates/homedashboard.html',
})
export class HomeDashboard implements AfterViewInit, OnDestroy {

    @ViewChild('dashboardcontainer', {read: ViewContainerRef}) private dashboardcontainer: ViewContainerRef;

    public componentSubscriptions: any[] = [];
    public dashboardid: string = '';
    public dashboardcontainercomponent: any = undefined;

    constructor(
        private broadcast: broadcast,
        private metadata: metadata,
        private language: language,
        private userpreferences: userpreferences) {
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));

        this.loadDashboardConfig();
    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.loadDashboardConfig();
                break;

        }
    }

    private loadDashboardConfig() {
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
