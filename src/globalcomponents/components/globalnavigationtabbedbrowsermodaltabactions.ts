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
    selector: 'global-navigation-tabbed-browser-modal-tab-actions',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedbrowsermodaltabactions.html'
})
export class GlobalNavigationTabbedBrowserModalTabActions {

    @Input() private tab: objectTab;

    constructor(private navigation: navigation, private language: language) {

    }

    /**
     * closes a tab
     *
     * @param tabid
     */
    private closetab(tabid) {
        this.navigation.closeObjectTab(tabid);
    }

    /**
     * close the tab
     */
    private pintab(tab: objectTab) {
        tab.pinned = !tab.pinned;
    }

    /**
     * clones the tab
     *
     * @param tab
     */
    private clonetab(tab: objectTab) {
        this.navigation.cloneTab(tab.id);
    }

}
