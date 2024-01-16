/**
 * @module GlobalComponents
 */
import {
    Component, Input, ElementRef
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {fromEvent} from "rxjs";
import {take} from "rxjs/operators";


@Component({
    selector: 'global-navigation-tabbed-menu-tab',
    templateUrl: '../templates/globalnavigationtabbedmenutab.html',
    host: {
        '[class.slds-context-bar__item]': '1',
        '[class.slds-context-bar__item_tab]': '1',
        '[class.slds-is-active]': 'isActive'
    }
})
export class GlobalNavigationTabbedMenuTab {
    /**
     * show contextMenu boolean
     */
    public showContextMenu: boolean = false;

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

    /**
     * the tab object
     */
    @Input() public object: objectTab;

    constructor(public navigation: navigation,public language: language, public elementRef: ElementRef) {

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
     *
     * @param tab
     */
    public clonetab() {
        this.navigation.cloneTab(this.object.id);
        this.closeContextMenu();
    }

    /**
     * returns the tabname
     */
    get tabname() {
        return this.object.displayname ? this.object.displayname : undefined;
    }

    /**
     * returns the tab module if a module is set
     */
    get tabmodule() {
        return this.object.displaymodule ? this.object.displaymodule : undefined;
    }

    /**
     * returns the tab module if a module is set
     */
    get tabicon() {
        return this.object.displayicon ? this.object.displayicon : undefined;
    }

    /**
     * gets maintabs
     */
    get mainTabs() {
        return this.navigation.objectTabs.filter(tab => tab.parentid == undefined);
    }

    /**
     * returns true if unsaved changed are in tab object
     */
    get isDirty() {
        return this.navigation.anyDirtyModel(this.object.id);
    }

    /**
     * opens context menu on right click
     */
    public openContextMenu(event: MouseEvent, container: HTMLElement){
            event.preventDefault();
            event.stopPropagation();
            this.showContextMenu = true;
            this.handleDocumentClick(container);
            this.setCloseButtonsDisabled();
    }

    /**
     * sets the button to disabled if there are no tabs to the right
     * @private
     */
    private setCloseButtonsDisabled() {
        const mainTabsWithoutPinned = this.mainTabs.filter(tab => !tab.pinned);
        let currentTab = mainTabsWithoutPinned.findIndex(tab => tab.id === this.object.id);

        this.buttonCloseTabsToRightDisabled =  currentTab >= mainTabsWithoutPinned.length-1;
        this.buttonCloseTabsToLeftDisabled =  currentTab <= 0;
        this.buttonCloseOtherTabsDisabled = mainTabsWithoutPinned.length <=1;
    }

    /**
     * closes context menu
     */
    public closeContextMenu(){
        this.showContextMenu = false;
    }

    /**
     * closes all other tabs, but the one clicked on
     */
    public closeOtherTabs(){
        let tabIds = this.mainTabs.map(tab => tab.id);
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
            let currentTab = this.mainTabs.findIndex(tab => tab.id === this.object.id);
            if (currentTab !== -1) {
                //let tabsToClose = this.mainTabs.slice(currentTab + 1);
                let tabsToClose = [];
                if(!this.object.pinned){
                    tabsToClose = this.mainTabs.slice(currentTab + 1).filter(tab => !tab.pinned);
                } else {
                    tabsToClose = this.mainTabs.filter(tab => !tab.pinned);
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
            let currentTab = this.mainTabs.findIndex(tab => tab.id === this.object.id);
            if (currentTab !== -1) {
                let tabsToClose = this.mainTabs.slice(0, currentTab);
                tabsToClose.forEach(tab => {
                    if(!tab.pinned){
                        this.navigation.closeObjectTab(tab.id);
                    }
                });
            }
        this.closeContextMenu();
    }

    /**
     * handle document click to close context menu
     */
     public handleDocumentClick(container: HTMLElement){
            fromEvent(window, 'mousedown').pipe(take(1)).subscribe(e => {
                if (!container.contains(e.target as HTMLElement)) {
                    this.showContextMenu = false;
                }
            });
    }


}
