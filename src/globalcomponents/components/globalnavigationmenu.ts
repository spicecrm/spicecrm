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
    AfterViewInit, Component, ViewChild, ViewContainerRef, ElementRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'global-navigation-menu',
    templateUrl: './src/globalcomponents/templates/globalnavigationmenu.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalNavigationMenu implements AfterViewInit {
    /**
     * a reference to the container with the menu items
     */
    @ViewChild('menucontainer', {read: ViewContainerRef, static: true}) private menucontainer: ViewContainerRef;

    /**
     * a referenmce to the container with the m,ore items
     */
    @ViewChild('morecontainer', {read: ViewContainerRef, static: true}) private morecontainer: ViewContainerRef;

    /**
     * the refgerence to the more item once the more component has been rendered
     */
    private moreComponentRef: any = undefined;

    /**
     * the menu items derived from the role
     */
    private menuItems: any[] = [];

    /**
     * the rendered menu items
     */
    private renderedItems: any[] = [];

    /**
     * the rendered more items
     */
    private moreItems: any[] = [];

    /**
     * inidcvates that an item is moved to the active state
     */
    private movingActive: boolean = false;

    /**
     * indicates that we are in teh rendering and calculation process
     */
    private rendering: boolean = false;


    /**
     * timeout function to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
     */
    private resizeTimeOut: any = undefined;

    constructor(private metadata: metadata, private elementRef: ElementRef, private broadcast: broadcast, private navigation: navigation) {
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

        this.navigation.activeModule$.subscribe(activeModule => this.checkActiveModule());
    }

    public ngAfterViewInit() {
        // build the internal menu items
        this.buildMenuItems();

        // render the menu
        this.renderMenu();
    }

    private buildMenuItems() {
        this.menuItems = [];

        let modules = this.metadata.getRoleModules(true);
        for (let module of modules) {
            this.menuItems.push(module);
        }
    }

    private handleResize() {
        this.buildMenuItems();

        if (this.resizeTimeOut) window.clearTimeout(this.resizeTimeOut);
        this.resizeTimeOut = window.setTimeout(() => this.renderMenu(), 250);
    }

    private checkActiveModule(): boolean {
        if (this.movingActive || this.rendering) return false;

        let activeIndex = this.menuItems.indexOf(this.navigation.activeModule);

        let isVisible = false;
        for (let item of this.renderedItems) {
            if (item.module == this.navigation.activeModule) {
                isVisible = true;
                break;
            }
        }

        if (!isVisible && activeIndex != 0 && activeIndex + 1 > this.renderedItems.length) {
            let activeItem = this.menuItems.splice(activeIndex, 1);

            let lastItem = this.renderedItems.pop();
            if (lastItem) {
                lastItem.componentRef.destroy();

                this.menuItems.splice(this.renderedItems.length, 0, activeItem[0])

                // set internally that we are moving the active item
                this.movingActive = true;
                this.destroyMoreItem();
                this.addMenuItem(this.menuItems[this.renderedItems.length], this.menuItems[this.renderedItems.length]);
            }
            return false;
        }

        return true;
    }

    private destroyMenu() {
        for (let item of this.renderedItems) {
            item.componentRef.destroy();
        }
        this.renderedItems = [];

        this.destroyMoreItem();

        this.movingActive = false;

    }

    private renderMenu() {
        // destroy the current menu
        this.destroyMenu();

        // start adding the first menu item
        this.rendering = true;
        this.addMenuItem(this.menuItems[0], this.menuItems[0]);
    }

    private addMenuItem(module, name) {
        this.metadata.addComponentDirect('GlobalNavigationMenuItem', this.menucontainer).subscribe(componentRef => {
            componentRef.instance.item = {
                module,
                name
            };

            this.renderedItems.push({
                module,
                componentRef
            });
        });
    }

    private addMoreItem() {
        // check if we have a more item .. if yes destroy it
        this.destroyMoreItem();

        this.metadata.addComponentDirect('GlobalNavigationMenuMore', this.menucontainer).subscribe(componentRef => {
            // get and set the more items
            this.moreItems = [];
            let j = this.renderedItems.length;
            while (j < this.menuItems.length) {
                this.moreItems.push(this.menuItems[j])
                j++;
            }
            componentRef.instance.moreMenuItems = this.moreItems;

            // set the more component ref
            this.moreComponentRef = {
                componentRef
            };

        });
    }

    private destroyMoreItem() {
        if (this.moreComponentRef) {
            this.moreComponentRef.componentRef.destroy();
            this.moreComponentRef = undefined;
        }
    }

    private getRenderedWidth() {
        let renderedWidth = 0;
        for (let item of this.renderedItems) {
            renderedWidth += item.width;
        }

        return renderedWidth;
    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
            case 'loader.reloaded':
                this.buildMenuItems();
                this.renderMenu();
                break;
            case 'navigation.itemadded':
                for (let item of this.renderedItems) {
                    if (item.module === message.messagedata.module) {
                        item.width = message.messagedata.width;
                    }
                }
                let renderedWidth = this.getRenderedWidth();

                // in case we are shifting for the active one no frther calulation needed
                if (this.movingActive) {
                    if (renderedWidth > (this.elementRef.nativeElement.offsetWidth)) {
                        // then we also need to delete one more
                    }
                    this.movingActive = false;
                    this.addMoreItem();
                } else {
                    // set the width

                    if (renderedWidth > (this.elementRef.nativeElement.offsetWidth)) {
                        // remove the last rendered item
                        let lastItem = this.renderedItems.pop();
                        lastItem.componentRef.destroy();

                        if (this.menuItems.length > this.renderedItems.length) {
                            this.addMoreItem();
                        } else {
                            this.rendering = false;
                        }
                    } else if (this.menuItems.length > this.renderedItems.length) {
                        this.addMenuItem(this.menuItems[this.renderedItems.length], this.menuItems[this.renderedItems.length]);
                    }
                }
                break;
            case 'navigation.moreadded':
                this.moreComponentRef.width = message.messagedata.width;
                if (this.renderedItems.length > 0 && this.getRenderedWidth() + message.messagedata.width > this.elementRef.nativeElement.offsetWidth) {
                    let lastItem = this.renderedItems.pop();
                    lastItem.componentRef.destroy();

                    if (this.checkActiveModule()) {
                        this.addMoreItem();
                    }

                }
                break;
        }
    }
}
