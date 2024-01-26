/**
 * @module GlobalComponents
 */
import {
    Component, Input, ElementRef, HostListener
} from "@angular/core";
import {navigation, objectTab} from "../../services/navigation.service";
import {fromEvent} from "rxjs";
import {take} from "rxjs/operators";

@Component({
    selector: 'global-navigation-tab-context-menu',
    templateUrl: '../templates/globalnavigationtabcontextmenu.html',
})

export class GlobalNavigationTabContextMenu {
    /**
     * the tab object
     */
    @Input() public object: objectTab;

    /**
     * show contextMenu boolean
     */
    public showContextMenu: boolean = false;

    /**
     * show tabType string
     */
    public tabType: string;

    /**
     * show contextMenu in Subtabs boolean
     */
    public showContextMenuSubTabs: boolean = false;

    /**
     * show option for "close tabs to the right" button
     */
    public buttonCloseTabsToRightDisabled = false;

    /**
     * show option for "close tabs to the left" button
     */
    public buttonCloseTabsToLeftDisabled = false;

    /**
     * show option for "close other tabs" button
     */
    public buttonCloseOtherTabsDisabled = false;

    constructor(public navigation: navigation, private elementRef: ElementRef, ) {
    }

    /**
     * gets maintabs
     */
    get mainTabs() {
        return this.navigation.objectTabs.filter(tab => tab.parentid == undefined);
    }

    /**
     * returns subtabs
     */
    get subTabs(): objectTab[] {
        return this.navigation.objectTabs.filter(tab => tab.parentid !== undefined);
    }

    /**
     * returns true if unsaved changed are in tab object
     */
    get isDirty() {
        return this.navigation.anyDirtyModel(this.object.id);
    }

    /**
     * returns if the tab is active
     */
    get isActive() {
        // check if the current is active
        if(this.object.id == this.navigation.activeTab) return true;

        // get the active tab object and if one is returned check the parent id
        let activeTab = this.navigation.getTabById(this.navigation.activeTab);
        if(activeTab && activeTab.parentid && this.object.id == activeTab.parentid) return true;

        // else not active
        return false;
    }

    /**
     * sets the current tab as the active tab
     */
    public setActive() {
        this.navigation.setActiveTab(this.object.id);
    }

    /**
     * close the tab
     */
    public closetab() {
        this.navigation.closeObjectTab(this.object.id);
    }

    /**
     * returns if the tab is pinned
     */
    get pinned() {
        return this.object.pinned;
    }

    /**
     * close the tab
     */
    public pintab() {
        this.object.pinned = !this.object.pinned;
    }

    /**
     * clones the tab
     //* @param tab
     */
    public clonetab() {
        this.navigation.cloneTab(this.object.id);
        this.closeContextMenu();
    }

    public checkTabType(){
        if(this.object.parentid == undefined){
            return this.tabType = "main"
        } else if(this.object.parentid !== undefined){
            return this.tabType = "sub"
        }
    }

    get tabsArray(){
        let tabType = this.checkTabType();
        return tabType === "main" ? this.mainTabs : this.subTabs;
    }

    /**
     * opens context menu on right click
     */
    @HostListener("contextmenu", ["$event"])
    public openContextMenu(event: MouseEvent){
        event.preventDefault();
        event.stopPropagation();
        this.checkTabType();
        this.setCloseButtonsDisabled();
        this.showContextMenu = true;
        this.handleDocumentClick();
    }

    /**
     * closes context menu
     */
    public closeContextMenu(){
        this.showContextMenu = false;
        this.showContextMenuSubTabs = false;
    }

    /**
     * sets the button to disabled if there are no tabs to the right, left or others on maintabs
     * @private
     */
    private setCloseButtonsDisabled(){
        const tabsWithoutPinned = this.tabsArray.filter(tab => !tab.pinned);
        let currentTab = tabsWithoutPinned.findIndex(tab => tab.id === this.object.id);
        this.buttonCloseTabsToRightDisabled =  currentTab >= tabsWithoutPinned.length-1;
        this.buttonCloseTabsToLeftDisabled =  currentTab <= 0;
        this.buttonCloseOtherTabsDisabled = tabsWithoutPinned.length <=1;
    }

    /**
     * move subtab into maintabs
     */
    public moveSubTabToMainTabs() {
        let currentTab = this.subTabs.find(tab => tab.id === this.object.id);
        currentTab.parentid = undefined;
        this.setActive();
        this.closeContextMenu();
    }

    /**
     * closes all other tabs, but the one clicked on
     */
    public closeOtherTabs(){
        let tabIds = this.tabsArray.map(tab => tab.id);
        tabIds.forEach((tabId) => {
            if(tabId !== this.object.id && !this.navigation.getTabById(tabId)?.pinned){
                this.navigation.closeObjectTab(tabId);
            }
        });
        this.setActive();
        this.closeContextMenu();
    }

    /**
     * closes all tabs to the right
     */
    public closeTabsRight(){
        let currentTab = this.tabsArray.findIndex(tab => tab.id === this.object.id);
        if (currentTab !== -1) {
            let tabsToClose = [];
            if(!this.object.pinned){
                tabsToClose = this.tabsArray.slice(currentTab + 1).filter(tab => !tab.pinned);
            } else {
                tabsToClose = this.tabsArray.filter(tab => !tab.pinned);
            }
            tabsToClose.forEach(tab => {
                this.navigation.closeObjectTab(tab.id);
            });
        }
        this.closeContextMenu();
    }

    /**
     * closes all tabs to the left
     */
    public closeTabsLeft(){
       let currentTab = this.tabsArray.findIndex(tab => tab.id === this.object.id);
        if (currentTab !== -1) {
            let tabsToClose = this.tabsArray.slice(0, currentTab);
            tabsToClose.forEach(tab => {
                if(!tab.pinned){
                    this.navigation.closeObjectTab(tab.id);
                }
            });
        }
        this.setActive()
        this.closeContextMenu();
    }

    /**
     * handle document click to close context menu
     */
    public handleDocumentClick(){
        const container = this.elementRef.nativeElement;
        fromEvent(window, 'mousedown').pipe(take(1)).subscribe(e => {
            if (!container.contains(e.target as HTMLElement)) {
                this.showContextMenu = false;
                this.showContextMenuSubTabs = false;
            }
        });
    }

}
