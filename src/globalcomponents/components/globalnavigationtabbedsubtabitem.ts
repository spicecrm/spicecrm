/**
 * @module GlobalComponents
 */
import {
    Component, ElementRef, Input
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {navigation, objectTab} from '../../services/navigation.service';
import {fromEvent} from "rxjs";
import {take} from "rxjs/operators";

@Component({
    selector: 'global-navigation-tabbed-subtab-item',
    templateUrl: '../templates/globalnavigationtabbedsubtabitem.html'
})
export class GlobalNavigationTabbedSubtabItem {
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

    /**
     * set if this is the maintab that is also represented here
     */
    @Input() public ismain: boolean = false;

    constructor(public metadata: metadata,public language: language,public navigation: navigation, public elementRef: ElementRef) {

    }

    /**
     * returns the tabname
     */
    get tabname() {
        return this.object?.displayname ? this.object.displayname : undefined;
    }

    /**
     * returns the tab module if a module is set
     */
    get tabmodule() {
        return this.object?.displaymodule ? this.object.displaymodule : undefined;
    }

    /**
     * returns the tab module if a module is set
     */
    get tabicon() {
        return this.object?.displayicon ? this.object.displayicon : undefined;
    }

    /**
     * returns if the tab is active
     * if it is the maintab no subtabs shoudl be active
     */
    get isActive() {
        return this.object && this.object.id == this.navigation.activeTab;
    }

    /**
     * sets the current tab as the active tab
     */
   public setActive() {
        this.navigation.setActiveTab(this.object.id);
    }

    /**
     * close the subtab
     */
   public closeSubTab() {
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
    public clonetab(tab: objectTab) {
        this.navigation.cloneTab(tab.id);
        this.closeContextMenu();
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
        const mainTabsWithoutPinned = this.subTabs.filter(tab => !tab.pinned);
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
    public closeOtherSubTabs(){
        let tabIds = this.subTabs.map(tab => tab.id);
        tabIds.forEach((tabId) => {
            if(tabId !== this.object.id && !this.pinned){
                this.navigation.closeObjectTab(tabId);
            }
        });
        this.setActive();
        this.closeContextMenu();
    }

    /**
     * closes all tabs to the right
     */
    public closeSubTabsRight(){
        let currentTab = this.subTabs.findIndex(tab => tab.id === this.object.id);
        if (currentTab !== -1) {
            //let tabsToClose = this.mainTabs.slice(currentTab + 1);
            let tabsToClose = [];
            if(!this.object.pinned){
                tabsToClose = this.subTabs.slice(currentTab + 1).filter(tab => !tab.pinned);
            } else {
                tabsToClose = this.subTabs.filter(tab => !tab.pinned);
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
    public closeSubTabsLeft(){
        let currentTab = this.subTabs.findIndex(tab => tab.id === this.object.id);
        if (currentTab !== -1) {
            let tabsToClose = this.subTabs.slice(0, currentTab);
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
