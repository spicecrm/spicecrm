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
     * clones the tab
     //* @param tab
     */
    public clonetab() {
        this.navigation.cloneTab(this.object.id);
        this.closeContextMenu();
    }

    /**
     * opens context menu on right click
     */
    @HostListener("contextmenu", ["$event"])
    public openContextMenu(event: MouseEvent){
        event.preventDefault();
        event.stopPropagation();
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
    public moveSubTabToMainTabs(){
        this.navigation.moveSubTabToMainTabs(this.object.id);
        this.setActive();
        this.closeContextMenu();
    }

    /**
     * sets button to disabled if there are no tabs to the right, left, or around
     */
    public setButtonsToClose(){
        this.buttonCloseOtherTabsDisabled = this.tabsArray.length <=1;
        this.buttonCloseTabsToLeftDisabled =  this.currentTabIndex <= 0;
        this.buttonCloseTabsToRightDisabled =  this.currentTabIndex >= this.tabsArray.length-1;
    }

    /**
     * closes the tabs, depending on which option has been chosen
     */
    public closeTabs(option : 'other' | 'right' | 'left', tabId: string){
        this.navigation.closeTabs(option, tabId, this.scope);
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
