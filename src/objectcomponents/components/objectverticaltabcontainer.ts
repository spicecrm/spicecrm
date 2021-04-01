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
 * @module ObjectComponents
 */
import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {session} from '../../services/session.service';

/**
 * renders a vertical tab container
 */
@Component({
    selector: 'object-vertical-tab-container',
    templateUrl: './src/objectcomponents/templates/objectverticaltabcontainer.html',
    styles: [
            `.slds-is-active {
            font-weight: 600;
            color: #3e3e3c;
            border-right: 1px solid #dddbda;
            border-left: 6px solid #CA1B21;
        }

        .slds-is-active a {
            text-decoration: none !important
        }`,
        '.slds-badge { font-weight: bold; background-color: #c00; color: #fff; padding: .125rem .4rem; }'
    ]
})
export class ObjectVerticalTabContainer implements OnInit {

    /**
     * the reference to the container
     */
    @ViewChild('tabscontainer', {read: ViewContainerRef, static: true}) private tabscontainer: ViewContainerRef;

    /**
     * the number of the active tab
     */
    private activeTab: number = 0;

    /**
     * holds which tabs have been activated already. Since tabs are only rendered when selected
     * for performance reasons this is the array to hold which have been rendered already
     */
    private activatedTabs: number[] = [0];

    /**
     * the component config
     */
    public componentconfig: any = [];

    constructor(private language: language, public metadata: metadata, private session: session) {
    }

    /**
     * loads the componentconfig if not passed in
     */
    public ngOnInit() {
        if (this.componentconfig && this.componentconfig.componentset) {
            let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
            this.componentconfig = [];
            for (let item of items) {
                // check if the tab is admin access only
                if (item.componentconfig.adminonly && !this.session.isAdmin) continue;

                // else add the tab
                this.componentconfig.push(item.componentconfig);
            }
        }
    }

    /**
     * a simple getter to see if the tabs are defined
     */
    private getTabs() {
        try {
            return this.componentconfig ? this.componentconfig : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * sets the index passed in as active tab
     *
     * @param index
     */
    private setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /**
     * checks if the tab with the given index is rendered already
     *
     * @param tabindex
     */
    private checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1 || (this.componentconfig && this.componentconfig[tabindex].forcerender);
    }

    /**
     * gets the style display property for the tab
     * @param tabindex
     */
    private getDisplay(tabindex) {
        let rect = this.tabscontainer.element.nativeElement.getBoundingClientRect();

        if (tabindex !== this.activeTab) {
            return {
                display: 'none'
            };
        }

        return {
            height: 'calc(99.9vh - ' + (rect.top) + 'px)'
        };
    }

    /**
     * retruns a specific sylte for the tab header
     *
     * ToDo: check if we still need this
     */
    private getTabsStyle() {
        let rect = this.tabscontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(99.9vh - ' + (rect.top) + 'px)',
            'overflow': 'auto',
            'overflow-x': 'hidden'
        };
    }

    /**
     * passes in if there are errors on the tab
     *
     * ToDo: check if we still need this
     *
     * @param tabindex
     * @param nrErrors
     */
    private showErrorsOnTab(tabindex, nrErrors) {
        this.componentconfig[tabindex].hasErrors = nrErrors;
    }

}
