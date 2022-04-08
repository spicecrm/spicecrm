/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, Input, ElementRef
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {language} from '../../services/language.service';

/**
 * renders a modal with the list of tabs and allows closing them, navigating to as well as providing some additonal informations
 */
@Component({
    templateUrl: '../templates/globalnavigationtabbedbrowsermodal.html'
})
export class GlobalNavigationTabbedBrowserModal {

    /**
     * reference to the modal component
     */
   public self: any;

    constructor(public navigation: navigation,public language: language) {

    }


    /**
     * returns the total count of tabs
     */
    get tabs() {
        return this.navigation.objectTabs.length;
    }

    /**
     * returns the total count of models
     */
    get models() {
        return this.navigation.modelregister.length;
    }

    /**
     * returns all tabs without a parent
     */
    get maintabs() {
        return this.navigation.objectTabs.filter(tab => !tab.parentid);
    }

    /**
     * returnst he subtabs for a given tabid
     *
     * @param parenttab
     */
   public subtabs(parenttab) {
        return this.navigation.objectTabs.filter(tab => tab.parentid == parenttab);
    }

    /**
     * closes a tab
     *
     * @param tabid
     */
   public closetab(tabid) {
        this.navigation.closeObjectTab(tabid);
    }

    /**
     * activate the tab with the given id and close the modal
     * @param tabid
     */
   public activateTab(tabid) {
        this.navigation.setActiveTab(tabid);
        this.close();
    }

    /**
     * close the tab
     */
   public pintab(tab: objectTab) {
        tab.pinned = !tab.pinned;
    }

    /**
     * clones the tab
     *
     * @param tab
     */
   public clonetab(tab: objectTab) {
        this.navigation.cloneTab(tab.id);
    }

    /**
     * close the modal
     */
   public close() {
        this.self.destroy();
    }

}
