/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, Input, OnDestroy, ViewChild} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation, objectTab} from '../../services/navigation.service';
import {Subscription} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {GlobalNavigationTabbedMenu} from "./globalnavigationtabbedmenu";
import {userpreferences} from "../../services/userpreferences.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {configurationService} from "../../services/configuration.service";

/** @ignore */
const ANIMATIONS = [
    trigger('isFocused', [
        state('expand', style({
            position: 'absolute',
            width: 'calc(100vw / 2)',
            'box-shadow': '#565555 -2px 0px 9px 0px',
            'z-index': 10
        })),
        state('collapse', style({
            position: 'initial',
            width: '15rem'
        })),
        transition('collapse <=> expand', [animate('200ms')])
    ])
];

@Component({
    selector: 'global-navigation-tabbed',
    templateUrl: '../templates/globalnavigationtabbed.html',
    animations: ANIMATIONS
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
   @Input() public progressWidth = 0;
    /**
     * true when there are backend pending requests
     */
   @Input() public showProgressBar = false;

    @ViewChild(GlobalNavigationTabbedMenu) private menuContainer: GlobalNavigationTabbedMenu;

    constructor(public metadata: metadata,
               public navigation: navigation,
               public userPreferences: userpreferences,
                public configurationService: configurationService,
               public cdRef: ChangeDetectorRef) {
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
     * no boirder top when context bar is collapsed
     */
    get contextbarStyle(){
        return this.userPreferences.toUse.globalHeaderCollapsed ? {'border-top': '0px'} : {};
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

    public toggleCollapse() {
        this.userPreferences.toUse.globalHeaderCollapsed = !this.userPreferences.toUse.globalHeaderCollapsed;
        this.userPreferences.setPreference('globalHeaderCollapsed', this.userPreferences.toUse.globalHeaderCollapsed);
        setTimeout(() => this.menuContainer.handleResize(), 200);
    }

    /**
     * handles the drop event
     * @param event
     */
    public drop(event: CdkDragDrop<objectTab[]>){

        if(event.previousContainer == event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }

        //find the index of our item in objectTabs array & splice the item it out from where it was
        const previousIndex = this.navigation.objectTabs.findIndex(t => t.id == event.item.data.id);
        const item = this.navigation.objectTabs.splice(previousIndex, 1)[0];
        const itemId = this.navigation.getTabById(item.id);

        //find the index of the item to the left of the currentIndex & then the objectTab itself
        const itemToLeftIndex = event.currentIndex - 1;
        const itemToLeft = event.container.data[itemToLeftIndex];

        //we figure out the index/position of our dropped item
        const dropIndex = itemToLeft ?  this.navigation.objectTabs.findIndex(t => t.id == itemToLeft.id) + 1 : 0 //event.container.data.findIndex(t => t.id == event.item.data.id);

        //we splice in our item BEFORE the drop index.
        this.navigation.objectTabs.splice(dropIndex, 0, item);

        if (event.previousContainer !== event.container) {
            event.item.data.parentid = undefined;
            this.setDisplaySubTabs(itemId)
        }
        this.navigation.setSessionData();
    }
}
