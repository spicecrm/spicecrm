/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, Input, ElementRef
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {language} from '../../services/language.service';

/**
 * renders teh more tab on the tabbed menu
 */
@Component({
    selector: 'global-navigation-tabbed-more-tab',
    templateUrl: '../templates/globalnavigationtabbedmoretab.html',
    host: {
        '[class.slds-context-bar__item]': '1',
        '[class.slds-is-active]': 'activeItem'
    }
})
export class GlobalNavigationTabbedMoreTab {

    public moreObjects: objectTab[] = [];

    constructor(public navigation: navigation,public language: language, public elementRef: ElementRef) {

    }

    /**
     * returns the tab with
     */
    get tabWidth() {
        return this.elementRef.nativeElement.getBoundingClientRect().width;
    }

    /**
     * set the active tab
     *
     * @param tabid
     */
   public setActiveTab(tabid) {
        this.navigation.setActiveTab(tabid);
    }

    /**
     * close the object tab
     *
     * @param tabid
     */
   public closeObjectTab(tabid) {
        this.navigation.closeObjectTab(tabid);
    }

    /**
     * returns if the tab is active
     */
    public isActive(tabid) {
        // check if the current is active
        if (tabid == this.navigation.activeTab) return true;

        // get the active tab object and if one is returned check the parent id
        let activeTab = this.navigation.getTabById(this.navigation.activeTab);
        if (activeTab && activeTab.parentid && tabid == activeTab.parentid) return true;

        // else not active
        return false;
    }

    /**
     * check if the tab has active items or any item has an active subtab
     * used to set the active class ont eh more tab
     */
    get activeItem() {

        // get the active tab object
        let activeTab = this.navigation.activeTabObject;

        // try to find an active tab
        return !!this.moreObjects.find(moretab =>  moretab.active || (activeTab && activeTab?.parentid == moretab.id));
    }

}
