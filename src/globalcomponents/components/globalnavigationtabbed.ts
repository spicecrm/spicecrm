/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {Subscription} from "rxjs";
import {backend} from "../../services/backend.service";

@Component({
    selector: 'global-navigation-tabbed',
    templateUrl: '../templates/globalnavigationtabbed.html',
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


   public subscriptions: Subscription = new Subscription();
    /**
     * holds the pending requests total count
     */
   public pendingRequestsTotal = 0;
    /**
     * holds the progress bar width in percent
     */
   public progressWidth = 0;

    constructor(public metadata: metadata,
               public navigation: navigation,
               public backend: backend,
               public cdRef: ChangeDetectorRef) {
    }

    /**
     * call subscribe to navigation changes
     */
    public ngAfterViewInit() {
        this.subscribeToBackendPendingRequests();
        this.subscribeToNavigationChanges();
    }

    /**
     * subscribe to backend pending requests to set the
     * @private
     */
    private subscribeToBackendPendingRequests() {
        this.subscriptions.add(this.backend.pendingCountChange$.subscribe(count => {

            if (count > this.pendingRequestsTotal) {
                this.pendingRequestsTotal = count;
            } else if (count == 0) {
                this.pendingRequestsTotal = 0;
            }

            this.progressWidth = count == 0 ? 100 : (100 / this.pendingRequestsTotal) * (this.pendingRequestsTotal - this.backend.pendingRequestsCount);

            this.cdRef.detectChanges();
        }));
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
   public setDisplaySubTabs(activeTab) {
        this.displaySubTabs = this.navigation.navigationparadigm == 'subtabbed' && !!activeTab && (!!activeTab.parentid || this.navigation.getSubTabs(activeTab.id).length > 0);
        this.cdRef.detectChanges();
    }

    /**
     * set the parent tab object
     * @param activeTab
     * @private
     */
   public setParentTab(activeTab) {
        this.parentTab = (activeTab && activeTab.parentid) ? this.navigation.getTabById(activeTab.parentid) : activeTab;
    }

    /**
     * subscribe to navigation changes to set local values
     * @private
     */
   public subscribeToNavigationChanges() {
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
   public handleNavigationChanges(tabId: string) {
        const activeTab = this.navigation.getTabById(tabId);
        this.setParentTab(activeTab);
        this.setDisplaySubTabs(activeTab);
    }
}
