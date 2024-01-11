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
     * returns subtabs
     */
    get subTabs(): objectTab[] {
        return this.navigation.objectTabs.filter(tab => tab.parentid !== undefined);
    }

    /**
     * opens context menu on right click
     */
    public openContextMenu(event: MouseEvent, container: HTMLElement){
        event.preventDefault();
        event.stopPropagation();
        this.showContextMenu = true;
        this.handleDocumentClick(container);
        this.setButtonCloseTabsToRightDisabled();
        this.setButtonCloseOtherTabsDisabled();
    }

    /**
     * sets the button to disabled if there are no tabs to the right
     * @private
     */
    private setButtonCloseTabsToRightDisabled() {
        let currentTab = this.subTabs.findIndex(tab => tab.id === this.object.id);
        this.buttonCloseTabsToRightDisabled = currentTab >= this.subTabs.length-1;
    }

    /**
     * sets the button to disabled if there are no tabs to the right
     * @private
     */
    private setButtonCloseOtherTabsDisabled() {
        //let currentTab = this.subTabs.findIndex(tab => tab.id === this.object.id);
        this.buttonCloseOtherTabsDisabled = this.subTabs.length <=1;
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
            if(tabId !== this.object.id){
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
            let tabsToClose = this.subTabs.slice(currentTab + 1);
            tabsToClose.forEach(tab => {
                this.navigation.closeObjectTab(tab.id);
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
