/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, Input, ElementRef
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {modal} from '../../services/modal.service';

/**
 * renders teh more tab on the tabbed menu
 */
@Component({
    selector: 'global-navigation-tabbed-browser',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedbrowser.html',
    host: {
        '[class.slds-context-bar__item]': '1',
        '(click)': 'openModal()'
    }
})
export class GlobalNavigationTabbedBrowser {

    constructor(private navigation: navigation, private modal: modal, public elementRef: ElementRef) {

    }

    /**
     * returns the tab with
     */
    get tabWidth() {
        return this.elementRef.nativeElement.getBoundingClientRect().width;
    }

    private openModal() {
        this.modal.openModal('GlobalNavigationTabbedBrowserModal').subscribe(ref => {
            console.log('opened');
        });
    }

}
