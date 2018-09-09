import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {session} from '../../../services/session.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';

@Component({
    selector: 'home-dashboard',
    templateUrl: './app/modules/home/templates/homedashboard.html',
})
export class HomeDashboard implements AfterViewInit, OnDestroy {

    @ViewChild('dashboardcontainer', {read: ViewContainerRef}) dashboardcontainer: ViewContainerRef;

    componentSubscriptions: Array<any> = [];
    dashboardid: string = '';
    dashboardcontainercomponent: any = undefined;

    constructor(private broadcast: broadcast, private navigation: navigation, private metadata: metadata, private session: session) {
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

    private  loadDashboardConfig() {
        let componentconfig = this.metadata.getComponentConfig('HomeDashboard', 'Home');
        if (componentconfig['dashboardid']) {
            this.dashboardid = componentconfig['dashboardid'];

            // set it to the component
            if(this.dashboardcontainercomponent){
                this.dashboardcontainercomponent.instance['dashboardid'] = this.dashboardid;
            }
        }

    }

    ngAfterViewInit(){
        this.metadata.addComponent('DashboardContainer', this.dashboardcontainer).subscribe(component => {
            component.instance['dashboardid'] = this.dashboardid;
            component.instance['context'] = 'Home';

            this.dashboardcontainercomponent = component;
        })
    }

    ngOnDestroy() {
        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }
}