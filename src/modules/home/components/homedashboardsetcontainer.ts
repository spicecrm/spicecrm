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
    public activeDashboardId: string = '';
    public dashboardContainerComponentRef: ComponentRef<any>;
    /**
     * list of dashboards related to a dashboardset
     */
    public dashboardsList: any[] = [];
    /**
     * list of overflowed dashboards
     */
    public moreDashboardsList: any[] = [];
    public isLoading: boolean = false;
    /**
     * view reference of more tab to render overflowed items inside
     */
    @ViewChild('moreTab', {read: ViewContainerRef, static: false}) private moreTab: ViewContainerRef;
    /**
     * view reference of main tabs used for the overflow handling
     */
    @ViewChildren('maintabs', {read: ViewContainerRef}) protected maintabs: QueryList<any>;
    /**
     * view reference of more tabs used for the overflow handling
     */
    @ViewChildren('moreTabItems', {read: ViewContainerRef}) protected moreTabItems: QueryList<any>;
    /**
     * view reference to render the active dashboard inside
     */
    @ViewChild('activeDashboardContainer', {read: ViewContainerRef}) private activeDashboardContainer: ViewContainerRef;

    private resizeListener: any;


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

    /**
     * @ignore
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.resetView();
        if (this.resizeListener) this.resizeListener();
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
                this.dashboardsList = _.toArray(res);
                if (this.dashboardsList.length > 0) this.setActiveDashboard(this.dashboardsList[0].id);
                this.handleOverflow();
                this.cdr.detectChanges();
            }
        });
        this.resizeListener = this.renderer.listen('window', 'resize', () => this.handleOverflow());
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

    /**
     * set the active dashboard id and rerender the view
    */
    private setActiveDashboard(dashboardId: string) {
        this.activeDashboardId = dashboardId;
        this.renderView();
    }

    /**
    * Handel tabs list overflow items and push the more items or destroy the overflow dropdown when not needed
    */
    private handleOverflow() {
        this.moreDashboardsList = [];
        // make sure we set all to hidden
        this.maintabs.forEach(thisitem => {
            thisitem.element.nativeElement.classList.remove('slds-hide');
            thisitem.element.nativeElement.classList.add('slds-hidden');
        });
        this.moreTab.element.nativeElement.classList.add('slds-hidden');
        this.moreTab.element.nativeElement.classList.remove('slds-hide');

        // get the total width and the more tab with
        let totalwidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        let morewidth = this.moreTab.element.nativeElement.getBoundingClientRect().width;
        let showMore = false;

        let usedWidth = 0;
        this.maintabs.forEach((thisitem, itemindex) => {
            let itemwidth = thisitem.element.nativeElement.getBoundingClientRect().width;
            usedWidth += itemwidth;
            if (usedWidth > totalwidth - morewidth) {
                // special handling for last element
                if (showMore || itemindex + 1 < this.maintabs.length || itemwidth > morewidth) {
                    thisitem.element.nativeElement.classList.add('slds-hide');
                    this.moreDashboardsList.push(thisitem.element.nativeElement.attributes.getNamedItem('data-dashboard').value);
                    showMore = true;
                }
            }
            thisitem.element.nativeElement.classList.remove('slds-hidden');
        });

        // handle the more element hidden attribute
        if (showMore) {
            this.moreTab.element.nativeElement.classList.remove('slds-hidden');

            this.moreTabItems.forEach(moreitem => {
                if (this.moreDashboardsList.indexOf(moreitem.element.nativeElement.attributes.getNamedItem('data-dashboard').value) >= 0) {
                    moreitem.element.nativeElement.classList.remove('slds-hide');
                } else {
                    moreitem.element.nativeElement.classList.add('slds-hide');
                }
            });

        } else {
            this.moreTab.element.nativeElement.classList.remove('slds-hidden');
            this.moreTab.element.nativeElement.classList.add('slds-hide');
        }

    }
}
