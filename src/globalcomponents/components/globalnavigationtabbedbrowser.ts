/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, Input, ElementRef
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {modal} from '../../services/modal.service';
import {animate, style, transition, trigger} from "@angular/animations";

/**
 * renders a button for the tab browser in the menu bar
 */
@Component({
    selector: 'global-navigation-tabbed-browser',
    templateUrl: '../templates/globalnavigationtabbedbrowser.html',
    host: {
        '[class.slds-context-bar__item]': '1',
        '(click)': 'openModal()'
    },
    animations: [
        trigger('browsertabbutton', [
            transition(':enter', [
                style({opacity: 0}),
                animate('.5s', style({opacity: 1}))
            ]),
            transition(':leave', [
                animate('.5s', style({opacity: 0}))
            ])
        ])
    ]
})
export class GlobalNavigationTabbedBrowser {

    constructor(public navigation: navigation,public modal: modal, public elementRef: ElementRef) {

    }

    /**
     * returns the tab with
     */
    get tabWidth() {
        return this.elementRef.nativeElement.getBoundingClientRect().width;
    }

    /**
     * returns true if there are no tabs
     */
    get hasTabs() {
        return this.navigation.objectTabs.length > 0;
    }

    /**
     * opens the browser modal window
     */
   public openModal() {
        this.modal.openModal('GlobalNavigationTabbedBrowserModal')
    }

}
