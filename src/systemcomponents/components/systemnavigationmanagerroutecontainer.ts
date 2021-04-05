/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/systemcomponents/templates/systemnavigationmanagerroutecontainer.html',
    providers: [navigationtab]
})
export class SystemNavigationManagerRouteContainer implements OnInit, OnDestroy {

    /**
     * the tab object
     */
    @Input() private object: objectTab;

    /**
     * the tabid
     */
    @Input() private tabid: string;

    /**
     * the id of the parenttab if this is a subtab
     */
    @Input() private parentttabid: string;

    /**
     * inidcates if the tab is loaded
     */
    private loaded = false;

    /**
     * the component from the dynamic route to be rendered
     */
    private routercomponent: string;

    /**
     * internally held rendere path
     */
    private renderedPath: string;

    /**
     * internally held rendered component
     */
    private rendererParams: string;

    /**
     * holds component subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private metadata: metadata, private language: language, private router: Router, private broadcast: broadcast, @SkipSelf() private navigation: navigation, private navigationtab: navigationtab, private changeDetectorRef: ChangeDetectorRef) {
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
    private setParentTabId() {
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
