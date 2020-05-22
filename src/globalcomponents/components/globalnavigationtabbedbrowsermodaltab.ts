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
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedbrowsermodaltab.html'
})
export class GlobalNavigationTabbedBrowserModalTab {

    /**
     * reference to the modal component
     */
    @Input() private tab: objectTab;

    /**
     * inicates that this is a subtab and shoudl be indented
     */
    @Input() private subtab: boolean = false;

    @Output() private activate: EventEmitter<string> = new EventEmitter<string>();

    constructor(private navigation: navigation, private language: language) {

    }

    /**
     * return the count of models for a given tab
     *
     * @param tabid
     */
    private modelCount() {
        return this.navigation.modelregister.filter(m => m.tabid == this.tab.id).length;
    }

    /**
     * activate the current tab
     */
    private activateTab() {
        this.activate.emit(this.tab.id);
    }

}
