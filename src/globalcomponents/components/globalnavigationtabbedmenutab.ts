/*
SpiceUI 2018.10.001

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


@Component({
    selector: 'global-navigation-tabbed-menu-tab',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedmenutab.html',
    host: {
        '[class.slds-context-bar__item]': '1',
        '[class.slds-context-bar__item_tab]': '1',
        '[class.slds-is-active]': 'isActive'
    }
})
export class GlobalNavigationTabbedMenuTab {

    /**
     * the tab object
     */
    @Input() public object: objectTab;

    constructor(private navigation: navigation, private language: language, public elementRef: ElementRef) {

    }


    /**
     * returns if the tab is active
     */
    get isActive() {
        // check if the current is active
        if(this.object.id == this.navigation.activeTab) return true;

        // get the active tab object and if one is returned check the parent id
        let activeTab = this.navigation.getTabById(this.navigation.activeTab);
        if(activeTab && activeTab.parentid && this.object.id == activeTab.parentid) return true;

        // else not active
        return false;
    }

    /**
     * sets the current tab as the active tab
     */
    private setActive() {
        this.navigation.setActiveTab(this.object.id);
    }

    /**
     * close the tab
     */
    private closetab() {
        this.navigation.closeObjectTab(this.object.id);
    }

    /**
     * returns if the tab is pinned
     */
    get pinned() {
        return this.object.pinned;
    }

    /**
     * close the tab
     */
    private pintab() {
        this.object.pinned = !this.object.pinned;
    }

    /**
     * returns the tabname
     */
    get tabname() {
        return this.object.displayname ? this.object.displayname : undefined;
    }

    /**
     * returns the tab module if a module is set
     */
    get tabmodule() {
        return this.object.displaymodule ? this.object.displaymodule : undefined;
    }

    /**
     * returns the tab module if a module is set
     */
    get tabicon() {
        return this.object.displayicon ? this.object.displayicon : undefined;
    }


}
