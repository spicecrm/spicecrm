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

/**
 * renders a modal with the list of tabs and allows closing them, navigating to as well as providing some additonal informations
 */
@Component({
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedbrowsermodal.html'
})
export class GlobalNavigationTabbedBrowserModal {

    /**
     * reference to the modal component
     */
    private self: any;

    constructor(private navigation: navigation, private language: language) {

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
    private subtabs(parenttab) {
        return this.navigation.objectTabs.filter(tab => tab.parentid == parenttab);
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
     * activate the tab with the given id and close the modal
     * @param tabid
     */
    private activateTab(tabid) {
        this.navigation.setActiveTab(tabid);
        this.close();
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

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

}
