/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, Input, ElementRef, Output, EventEmitter
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {language} from '../../services/language.service';

/**
 * renders the info for one tab in the tab browser modal
 */
@Component({
    selector: 'global-navigation-tabbed-browser-modal-tab',
    templateUrl: '../templates/globalnavigationtabbedbrowsermodaltab.html'
})
export class GlobalNavigationTabbedBrowserModalTab {

    /**
     * reference to the modal component
     */
    @Input()public tab: objectTab;

    /**
     * inicates that this is a subtab and shoudl be indented
     */
    @Input()public subtab: boolean = false;

    @Output()public activate: EventEmitter<string> = new EventEmitter<string>();

    constructor(public navigation: navigation,public language: language) {

    }

    /**
     * return the count of models for a given tab
     *
     * @param tabid
     */
   public modelCount() {
        return this.navigation.modelregister.filter(m => m.tabid == this.tab.id).length;
    }

    /**
     * activate the current tab
     */
   public activateTab() {
        this.activate.emit(this.tab.id);
    }

}
