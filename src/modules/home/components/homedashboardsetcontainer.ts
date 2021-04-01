/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleHome
 */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    ElementRef,
    OnDestroy,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {userpreferences} from "../../../services/userpreferences.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";

/** @ignore */
declare var _;

/**
 * displays a set of dashboards related to a dashboardset module.
 */
@Component({
    selector: 'home-dashboardset-container',
    templateUrl: './src/modules/home/templates/homedashboardsetcontainer.html'
})
export class HomeDashboardSetContainer implements AfterViewInit, OnDestroy {

    public subscriptions: Subscription = new Subscription();
    public dashboardContainerComponentRef: ComponentRef<any>;
    /**
     * list of dashboards related to a dashboardset
     */
    public dashboardsList: any[] = [];
    public isLoading: boolean = false;
    /**
     * view reference of main tabs used for the overflow handling
     */
    @ViewChildren('maintabs', {read: ViewContainerRef}) protected maintabs: QueryList<any>;
    /**
     * view reference of more tabs used for the overflow handling
     */
    @ViewChildren('moreTabItems', {read: ViewContainerRef}) protected moreTabItems: QueryList<any>;
    /**
     * view reference of more tab to render overflowed items inside
     */
    @ViewChild('moreTab', {read: ViewContainerRef, static: false}) private moreTab: ViewContainerRef;
    /**
     * view reference to render the active dashboard inside
     */
    @ViewChild('activeDashboardContainer', {read: ViewContainerRef}) private activeDashboardContainer: ViewContainerRef;

    constructor(
        private broadcast: broadcast,
        private metadata: metadata,
        private language: language,
        private renderer: Renderer2,
        private backend: backend,
        private elementRef: ElementRef,
        private cdr: ChangeDetectorRef,
        private userpreferences: userpreferences) {
        this.subscribeToBroadcast();
        this.loadDashboardConfig();

    }

    private _activeDashboardId: string = '';

    /**
     * @return active dashboard id
     */
    get activeDashboardId(): string {
        return this._activeDashboardId;
    }

    /**
     * set active dashboard id
     * @param value
     */
    set activeDashboardId(value: string) {
        this._activeDashboardId = value;
        this.renderView();
    }

    /**
     * @ignore
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.resetView();
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        this.loadDashboards();
    }

    private subscribeToBroadcast() {
        this.subscriptions.add(this.broadcast.message$.subscribe(message => {
            this.handleBroadcastSubscription(message);
        }));
    }

    /**
     * load related dashboards for the dashboardset
     * handle the overflowed dashboard tabs
     * listen to resize event and handle overflow
     */
    private loadDashboards() {
        // set isLoading on timeout to prevent angular change detection error
        this.isLoading = true;
        this.cdr.detectChanges();
        this.loadDashboardSetDashboards().subscribe(res => {
            this.isLoading = false;
            if (res) {
                this.dashboardsList = _.toArray(res).map(item => ({label: item.name, value: item.id}));
                if (this.dashboardsList.length > 0) {
                    this.activeDashboardId = this.dashboardsList[0].value;
                }
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Handel role changes and set the role dashboard
     * @param message: broadcastMessage
     */
    private handleBroadcastSubscription(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.loadDashboardConfig();
                break;
        }
    }

    /**
     * load dashboard config from user preferences
     * set the active dashboard id
     * pass the active dashboard id to the dashboard container reference
     */
    private loadDashboardConfig() {
        let homeDashboard = this.userpreferences.toUse.home_dashboard || undefined;
        let activeRole = this.metadata.getActiveRole();
        this.activeDashboardId = homeDashboard || activeRole.default_dashboard || '';

        // set it to the component
        if (this.dashboardContainerComponentRef) {
            this.dashboardContainerComponentRef.instance.dashboardid = this.activeDashboardId;
        }
    }

    /**
     * render the DashboardContainer in the active dashboard container and pass the necessary params to it
     */
    private renderView() {

        this.resetView();
        if (!this.activeDashboardContainer) return;
        this.metadata.addComponent('DashboardContainer', this.activeDashboardContainer).subscribe(component => {
            component.instance.dashboardid = this.activeDashboardId;
            component.instance.context = 'Home';

            this.dashboardContainerComponentRef = component;
        });
    }

    /**
     * destroy the dashboardContainerComponentRef
     */
    private resetView() {
        if (this.dashboardContainerComponentRef) {
            this.dashboardContainerComponentRef.destroy();
            this.dashboardContainerComponentRef = undefined;
        }
    }

    /**
     * define the observable of dashboards list related to the dashboardset from backend
     * @return Observable<dashboards[]>
     */
    private loadDashboardSetDashboards() {
        let dashboardSetId = this.userpreferences.toUse.home_dashboardset;
        let config = this.metadata.getComponentConfig('HomeDashboardSetContainer', 'Home');
        let params = {
            limit: -99,
            modulefilter: config.moduleFilter,
            sort: {sortfield: "dashboardsets_dashboard_sequence", sortdirection: "ASC"}
        };

        return this.backend.getRequest(`module/DashboardSets/${dashboardSetId}/related/dashboards`, params);
    }
}
