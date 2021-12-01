/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, Input, ElementRef
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {GlobalNavigationTabbedMoreTab} from "./globalnavigationtabbedmoretab";

/**
 * renders teh more tab on the tabbed menu
 */
@Component({
    selector: 'global-navigation-tabbed-sub-tab-more-tab',
    templateUrl: '../templates/globalnavigationtabbedsubtabmoretab.html'
})
export class GlobalNavigationTabbedSubTabMoreTab extends GlobalNavigationTabbedMoreTab {

    /**
     * returns if the tab is active
     */
    get moreActive() {
        let active = false;

        // loop over the tabs
        this.moreObjects.some(tab => {
            if (tab.active) {
                active = true;
                return true;
            }
        })

        return active;
    }

}
