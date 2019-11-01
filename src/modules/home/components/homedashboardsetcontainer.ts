/**
 * @module ModuleHome
 */
import {
    AfterViewInit,
    Component,
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
import {navigation} from "../../../services/navigation.service";
import {backend} from "../../../services/backend.service";

declare var _;

@Component({
    selector: 'home-dashboardset-container',
    templateUrl: './src/modules/home/templates/homedashboardsetcontainer.html'
})
export class HomeDashboardSetContainer implements AfterViewInit, OnDestroy {

    public componentSubscriptions: any[] = [];
    public dashboardid: string = '';
    public dashboardcontainercomponent: any = undefined;
    public dashboardsList: any[] = [];
    public moreDashboardsList: any[] = [];
    public isLoading: boolean = false;

    @ViewChild('allDashboardsContainer', {
        read: ViewContainerRef,
        static: true
    }) private allDashboardsContainer: ViewContainerRef;
    @ViewChildren('maintabs', {read: ViewContainerRef}) private maintabs: QueryList<any>;
    @ViewChildren('moretabs', {read: ViewContainerRef}) private moretabs: QueryList<any>;
    @ViewChild('moretab', {read: ViewContainerRef, static: false}) private moretab: ViewContainerRef;
    private resizeListener: any;


    constructor(
        private broadcast: broadcast,
        private metadata: metadata,
        private language: language,
        private renderer: Renderer2,
        private navigation: navigation,
        private backend: backend,
        private elementRef: ElementRef,
        private userpreferences: userpreferences) {
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));
        this.loadDashboardConfig();

    }

    public ngOnInit() {
        this.setNavigationHasSubTabValue('Home');
    }

    public ngOnDestroy() {
        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
        this.resetView();
        if (this.resizeListener) this.resizeListener();
        this.setNavigationHasSubTabValue(undefined);
    }

    public ngAfterViewInit() {
        this.loadDashboards();
    }

    private setNavigationHasSubTabValue(value) {
        this.navigation.hasSubTabs = value;
    }

    private loadDashboards() {
        // set isLoading on timeout to prevent angular change detection error
        window.setTimeout(()=> this.isLoading = true);
        this.loadDashboardSetDashboards().subscribe(res => {
            this.isLoading = false;
            if (res) {
                this.dashboardsList = _.toArray(res);
                if (this.dashboardsList.length > 0) this.setActiveDashboard(this.dashboardsList[0].id);
                window.setTimeout(() => this.handleOverflow());
            }
        });
        this.resizeListener = this.renderer.listen('window', 'resize', e => this.handleOverflow());
    }

    /*
    * Handel role changes and set the role dashboard
    * @returns void
    */
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.loadDashboardConfig();
                break;

        }
    }

    /*
    * @returns void
    */
    private loadDashboardConfig() {
        let homeDashboard = this.userpreferences.toUse.home_dashboard || undefined;
        let activeRole = this.metadata.getActiveRole();
        this.dashboardid = homeDashboard || activeRole.default_dashboard || '';

        // set it to the component
        if (this.dashboardcontainercomponent) {
            this.dashboardcontainercomponent.instance.dashboardid = this.dashboardid;
        }
    }

    /*
    * @param container: string
    * @returns void
    */
    private renderView() {

        this.resetView();
        this.metadata.addComponent('DashboardContainer', this.allDashboardsContainer).subscribe(component => {
            component.instance.dashboardid = this.dashboardid;
            component.instance.context = 'Home';

            this.dashboardcontainercomponent = component;
        });
    }

    /*
    * @returns void
    */
    private resetView() {
        if (this.dashboardcontainercomponent) {
            this.dashboardcontainercomponent.destroy();
            this.dashboardcontainercomponent = undefined;
        }
    }

    /*
    * @returns observable
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

    /*
    * @param id: dashboardId
    * @returns void
    */
    private setActiveDashboard(dashboardId) {
        this.dashboardid = dashboardId;
        this.renderView();
    }

    /*
    * Handel tabs list overflow items and push the more items.
    * @returns observable
    */
    private handleOverflow() {
        this.moreDashboardsList = [];
        // make sure we set all to hidden
        this.maintabs.forEach(thisitem => {
            thisitem.element.nativeElement.classList.remove('slds-hide');
            thisitem.element.nativeElement.classList.add('slds-hidden');
        });
        this.moretab.element.nativeElement.classList.add('slds-hidden');
        this.moretab.element.nativeElement.classList.remove('slds-hide');

        // get the total width and the more tab with
        let totalwidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        let morewidth = this.moretab.element.nativeElement.getBoundingClientRect().width;
        let showmore = false;

        let usedWidth = 0;
        this.maintabs.forEach((thisitem, itemindex) => {
            let itemwidth = thisitem.element.nativeElement.getBoundingClientRect().width;
            usedWidth += itemwidth;
            if (usedWidth > totalwidth - morewidth) {
                // special handling for last element
                if (showmore || itemindex + 1 < this.maintabs.length || itemwidth > morewidth) {
                    thisitem.element.nativeElement.classList.add('slds-hide');
                    this.moreDashboardsList.push(thisitem.element.nativeElement.attributes.getNamedItem('data-dashboard').value);
                    showmore = true;
                }
            }
            thisitem.element.nativeElement.classList.remove('slds-hidden');
        });

        // handle the more element hidden attribute
        if (showmore) {
            this.moretab.element.nativeElement.classList.remove('slds-hidden');

            this.moretabs.forEach(moreitem => {
                if (this.moreDashboardsList.indexOf(moreitem.element.nativeElement.attributes.getNamedItem('data-dashboard').value) >= 0) {
                    moreitem.element.nativeElement.classList.remove('slds-hide');
                } else {
                    moreitem.element.nativeElement.classList.add('slds-hide');
                }
            });

        } else {
            this.moretab.element.nativeElement.classList.remove('slds-hidden');
            this.moretab.element.nativeElement.classList.add('slds-hide');
        }

    }
}
