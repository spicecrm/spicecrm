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
    AfterViewInit, Component, ViewChild, ViewContainerRef, ElementRef, ViewChildren, QueryList, OnDestroy
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {SystemResizeDirective} from "../../directives/directives/systemresize";
import {GlobalNavigationTabbedMenuModules} from "./globalnavigationtabbedmenumodules";
import {GlobalNavigationTabbedMoreTab} from "./globalnavigationtabbedmoretab";
import {GlobalNavigationTabbedMenuTab} from "./globalnavigationtabbedmenutab";
import {GlobalNavigationTabbedBrowser} from "./globalnavigationtabbedbrowser";
import {Subscription} from "rxjs";

@Component({
    selector: 'global-navigation-tabbed-menu',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedmenu.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalNavigationTabbedMenu implements OnDestroy {

    /**
     * reference to the module menu item
     */
    @ViewChild(GlobalNavigationTabbedMenuModules) private menuModules: GlobalNavigationTabbedMenuModules;

    /**
     * reference to the navigation tabs
     */
    @ViewChildren(GlobalNavigationTabbedMenuTab) private menuTabs: QueryList<GlobalNavigationTabbedMenuTab>;

    /**
     * reference to the more item
     */
    @ViewChild(GlobalNavigationTabbedMoreTab) private menuMore: GlobalNavigationTabbedMoreTab;

    /**
     * reference to the more item
     */
    @ViewChild(GlobalNavigationTabbedBrowser) private menuBrowser: GlobalNavigationTabbedBrowser;

    /**
     * timeout function to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
     */
    private resizeTimeOut: any = undefined;

    /**
     * the component subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private metadata: metadata, private elementRef: ElementRef, private broadcast: broadcast, private navigation: navigation) {
        this.subscriptions.add(
            this.navigation.objectTabsChange$.subscribe(changed => {
                // little bit of an ugly trick to come after the change detection run
                window.setTimeout(() => {
                    this.handleResize();
                });
            })
        );
    }

    /**
     * unsubscribe from all subscriptions we might have
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    /**
     * returns only the main objecttabs
     */
    get objectTabs() {
        return this.navigation.objectTabs.filter(tab => !tab.parentid).sort((t1, t2) => {
            // if values are equal return 0
            if ((t1.pinned && t2.pinned) || (!t1.pinned && !t2.pinned)) return 0;
            return t1.pinned ? -1 : 1;
        });
    }

    /**
     * a tracker function for the for loop
     *
     * @param index
     * @param item
     */
    private trackByFn(index, item) {
        return item.id;
    }

    /**
     * handle the resize and calculöate the total width as well as overflow
     */
    private handleResize() {

        // caluclate the width of the various items
        let left = this.elementRef.nativeElement.getBoundingClientRect().left;
        let menuWidth = this.menuModules.tabWidth;
        let browserWidth = this.menuBrowser.tabWidth;
        let totalWidth = window.innerWidth - left - menuWidth - browserWidth;

        // get the width of the more item
        this.menuMore.elementRef.nativeElement.classList.remove('slds-hide');
        this.menuMore.elementRef.nativeElement.classList.add('slds-hidden');
        this.menuMore.moreObjects = [];
        let moreWidth = this.menuMore.tabWidth;

        this.menuTabs.forEach(thisitem => {
            thisitem.elementRef.nativeElement.classList.remove('slds-hide');
            thisitem.elementRef.nativeElement.classList.add('slds-hidden');
        });

        let usedWidth = 0;
        let showmore = false;

        this.menuTabs.forEach((thisItem, itemIndex) => {
            let itemwidth = thisItem.elementRef.nativeElement.getBoundingClientRect().width;
            usedWidth += itemwidth;
            if (showmore || (itemIndex + 1 == this.menuTabs.length && usedWidth > totalWidth) || (itemIndex + 1 < this.menuTabs.length &&  usedWidth > totalWidth - moreWidth)) {
                // special handling for last element
                // if (showmore || itemIndex + 1 < this.menuTabs.length || itemwidth < moreWidth) {
                thisItem.elementRef.nativeElement.classList.add('slds-hide');
                // this.moreModules.push(thisitem.element.nativeElement.attributes.getNamedItem('data-module').value);
                showmore = true;

                this.menuMore.moreObjects.push(thisItem.object);
                // }
            }
            thisItem.elementRef.nativeElement.classList.remove('slds-hidden');

        });

        if (showmore) {
            this.menuMore.elementRef.nativeElement.classList.remove('slds-hidden');
        } else {
            this.menuMore.elementRef.nativeElement.classList.add('slds-hide');
        }

        return true;
    }
}
