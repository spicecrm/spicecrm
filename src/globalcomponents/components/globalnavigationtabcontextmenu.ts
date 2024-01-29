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
     * show option for "close other tabs" button
     */
    public buttonCloseOtherTabsDisabled = false;

    /**
     * show option for "close tabs to the left" button
     */
    public buttonCloseTabsToLeftDisabled = false;

    /**
     * show option for "close tabs to the right" button
     */
    public buttonCloseTabsToRightDisabled = false;

    constructor(public navigation: navigation, private elementRef: ElementRef, ) {
    }

    get currentTabIndex(){
        return this.tabsArray.findIndex(tab => tab.id === this.object.id);
    }

    get currentTabId(){
        return this.object.id
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
        this.setButtonsToClose();
        this.showContextMenu = true;
        this.handleDocumentClick();
    }

    /**
     * closes context menu
     */
    public closeContextMenu(){
        this.showContextMenu = false;
    }

    /**
     * move subtab into maintabs
     */
    public moveSubTabToMainTabs() {
        let currentSubTab = this.subTabs.find(tab => tab.id === this.object.id);
        currentSubTab.parentid = undefined;
        this.setActive();
        this.closeContextMenu();
    }

    public findsTabsToClose(){
        const tabsWithoutPinned = this.tabsArray.filter(tab => !tab.pinned);
        let otherTabs = tabsWithoutPinned.filter(tab => tab.id !== this.currentTabId);
        let tabsLeft = tabsWithoutPinned.slice(0, this.currentTabIndex);
        let tabsRight = tabsWithoutPinned.slice(this.currentTabIndex + 1);
        return [otherTabs, tabsRight, tabsLeft]
    }

    public setButtonsToClose(){
        this.buttonCloseOtherTabsDisabled = this.tabsArray.length <=1;
        this.buttonCloseTabsToLeftDisabled =  this.currentTabIndex <= 0;
        this.buttonCloseTabsToRightDisabled =  this.currentTabIndex >= this.tabsArray.length-1;
    }

    public closeTabs(option : string){
        const [otherTabs, tabsRight, tabsLeft] = this.findsTabsToClose();
        switch(option){
            case "other":
                otherTabs.forEach((tab) => {
                    this.navigation.closeObjectTab(tab.id);
                })
                this.setActive();
                break;
            case "left":
                tabsLeft.forEach((tab) => {
                    this.navigation.closeObjectTab(tab.id);
                })
                this.setActive()
                break;
            case "right":
                tabsRight.forEach((tab) => {
                    this.navigation.closeObjectTab(tab.id);
                })
                break;
        }
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
            }
        });
    }
}
