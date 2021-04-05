/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedbrowser.html',
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

    constructor(private navigation: navigation, private modal: modal, public elementRef: ElementRef) {

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
    private openModal() {
        this.modal.openModal('GlobalNavigationTabbedBrowserModal')
    }

}
