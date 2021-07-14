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
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'global-navigation-tabbed',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbed.html',
})
export class GlobalNavigationTabbed implements OnDestroy {
    /**
     * holds the parent tab object
     */
    public parentTab: any;
    /**
     * do not show when no sub tabs are enabled or tab is main (main has no sub tabs at this point in time
     */
    public displaySubTabs: boolean = false;


    private subscriptions: Subscription = new Subscription();

    constructor(private metadata: metadata,
                private navigation: navigation,
                private cdRef: ChangeDetectorRef) {

    }

    /**
     * call subscribe to navigation changes
     */
    public ngAfterViewInit() {
        this.subscribeToNavigationChanges();
    }

    /**
     * unsubscribe from any subscription we still might have
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * set the display sub tabs value
     */
    private setDisplaySubTabs(activeTab) {
        this.displaySubTabs = this.navigation.navigationparadigm == 'subtabbed' && !!activeTab && (!!activeTab.parentid || this.navigation.getSubTabs(activeTab.id).length > 0);
        this.cdRef.detectChanges();
    }

    /**
     * set the parent tab object
     * @param activeTab
     * @private
     */
    private setParentTab(activeTab) {
        this.parentTab = activeTab.parentid ? this.navigation.getTabById(activeTab.parentid) : activeTab;
    }

    /**
     * subscribe to navigation changes to set local values
     * @private
     */
    private subscribeToNavigationChanges() {
        this.subscriptions.add(
            this.navigation.activeTab$.subscribe((tabId: string) => {
                this.handleNavigationChanges(tabId);
            })
        );
        this.subscriptions.add(
            this.navigation.objectTabsChange$.subscribe(() => {
                this.handleNavigationChanges(this.navigation.activeTab);
            })
        );
    }

    /**
     * set the parent tab and set the display sub tabs value
     * @param tabId
     * @private
     */
    private handleNavigationChanges(tabId: string) {
        const activeTab = this.navigation.getTabById(tabId);
        this.setParentTab(activeTab);
        this.setDisplaySubTabs(activeTab);
    }
}
