/**
 * @module SystemComponents
 */
import {
    Component,
    Input,
    OnInit,
    ChangeDetectorRef,
    SkipSelf,
    OnDestroy
} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {navigation, objectTab, objectTabInfo} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';

declare var _: any;

/**
 * a componment that renders a route container that is rendered for each active tab
 *
 * for each route a container is rendered. Which one is visible is then triggered by the navigation service
 * that sets the active tab
 */
@Component({
    selector: 'system-navigation-manager-route-container',
    templateUrl: '../templates/systemnavigationmanagerroutecontainer.html',
    providers: [navigationtab]
})
export class SystemNavigationManagerRouteContainer implements OnInit, OnDestroy {

    /**
     * the tab object
     */
    @Input() public object: objectTab;

    /**
     * the tabid
     */
    @Input() public tabid: string;

    /**
     * the id of the parenttab if this is a subtab
     */
    @Input() public parentttabid: string;

    /**
     * inidcates if the tab is loaded
     */
    public loaded = false;

    /**
     * the component from the dynamic route to be rendered
     */
    public routercomponent: string;

    /**
     * internally held rendere path
     */
    public renderedPath: string;

    /**
     * internally held rendered component
     */
    public rendererParams: string;

    /**
     * holds component subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public metadata: metadata, public language: language, public router: Router, public broadcast: broadcast, @SkipSelf() public navigation: navigation, public navigationtab: navigationtab, public changeDetectorRef: ChangeDetectorRef) {
        this.changeDetectorRef.detach();

        // add  subscription to the nav service
        this.subscriptions.add(
            this.navigationtab.tabinfo$.subscribe((tabinfo: objectTabInfo) => {
                this.navigation.settabinfo(this.tabid, tabinfo);
            })
        );

        // add a subscription to ensable closing the tab
        this.subscriptions.add(
            this.navigationtab.close$.subscribe(close => {
                this.navigation.closeObjectTab(this.tabid, true);
            })
        );
    }

    public ngOnInit(): void {

        // set the parent tab id on the navigation tab
        this.setParentTabId();

        // subscribe to the tabid change
        this.subscriptions.add(
            this.navigation.activeTab$.subscribe(activetab => {
                if (activetab == this.tabid) {
                    let component;
                    switch (this.tabid) {
                        case 'main':
                            if (this.renderedPath != this.navigation.maintab.path || !_.isEqual(this.rendererParams, this.navigation.maintab.params)) {
                                component = this.metadata.getRouteComponent(this.navigation.maintab.path);
                                this.routercomponent = component ? component : undefined;
                                this.navigationtab.activeRoute = {
                                    path: this.navigation.maintab.path,
                                    params: this.navigation.maintab.params
                                };
                                this.navigationtab.activeRoute$.next(this.navigationtab.activeRoute);

                                this.renderedPath = this.navigation.maintab.path;
                                this.rendererParams = {...this.navigation.maintab.params};
                            }
                            break;
                        default:
                            if (this.renderedPath != this.object.path || !_.isEqual(this.rendererParams, this.object.params)) {
                                component = this.metadata.getRouteComponent(this.object.path.replace('tab/:tabid/', ''));
                                this.routercomponent = component ? component : undefined;
                                this.navigationtab.activeRoute = {
                                    path: this.object.path,
                                    params: this.object.params
                                };
                                this.navigationtab.activeRoute$.next(this.navigationtab.activeRoute);

                                this.renderedPath = this.object.path;
                                this.rendererParams = {...this.object.params};
                            }
                            break;
                    }
                    this.loaded = true;
                    this.changeDetectorRef.reattach();
                    this.changeDetectorRef.markForCheck();
                } else {
                    this.changeDetectorRef.detach();
                    this.changeDetectorRef.detectChanges();
                }
            })
        );
    }

    /**
     * set the parent tab id to the navigation tab service
     */
    public setParentTabId() {
        // pass on the tab id if we are not on main, the navigation is subtabbed and the object allows for subtabs
        if (this.tabid != 'main' && this.navigation.navigationparadigm == 'subtabbed' && this.object.enablesubtabs) {
            this.navigationtab.tabid = this.parentttabid ? this.parentttabid : this.tabid;
        }
    }

    /**
     * unsubscribe from any pending subscription
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns if the current tba is active
     */
    get isActive() {
        return this.navigation.displayTab == this.tabid;
    }
}
