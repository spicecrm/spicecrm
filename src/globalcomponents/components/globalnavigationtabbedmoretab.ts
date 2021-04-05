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
import {language} from '../../services/language.service';

/**
 * renders teh more tab on the tabbed menu
 */
@Component({
    selector: 'global-navigation-tabbed-more-tab',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedmoretab.html',
    host: {
        '[class.slds-context-bar__item]': '1',
        '[class.slds-is-active]': 'activeItem'
    }
})
export class GlobalNavigationTabbedMoreTab {

    public moreObjects: objectTab[] = [];

    constructor(private navigation: navigation, private language: language, public elementRef: ElementRef) {

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
    private setActiveTab(tabid) {
        this.navigation.setActiveTab(tabid);
    }

    /**
     * close the object tab
     *
     * @param tabid
     */
    private closeObjectTab(tabid) {
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
