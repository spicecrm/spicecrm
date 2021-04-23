/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'global-navigation-tabbed',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbed.html',
})
export class GlobalNavigationTabbed {
    /**
     * holds the parent tab object
     */
    public parentTab: any;
    /**
     * do not show when no sub tabs are enabled or tab is main (main has no sub tabs at this point in time
     */
    public displaySubTabs: boolean = false;


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
        this.navigation.activeTab$.subscribe((tabId: string) => {
            this.handleNavigationChanges(tabId);
        });
        this.navigation.objectTabsChange$.subscribe(() => {
            this.handleNavigationChanges(this.navigation.activeTab);
        });
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
