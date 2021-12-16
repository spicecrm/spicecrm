/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, Input, ElementRef
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {language} from '../../services/language.service';


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


}
