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
    templateUrl: '../templates/globalnavigationmenu.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalNavigationMenu implements AfterViewInit {
    /**
     * a reference to the container with the menu items
     */
    @ViewChild('menucontainer', {read: ViewContainerRef, static: true})public menucontainer: ViewContainerRef;

    /**
     * a referenmce to the container with the m,ore items
     */
    @ViewChild('morecontainer', {read: ViewContainerRef, static: true})public morecontainer: ViewContainerRef;

    /**
     * the refgerence to the more item once the more component has been rendered
     */
   public moreComponentRef: any = undefined;

    /**
     * the menu items derived from the role
     */
   public menuItems: any[] = [];

    /**
     * the rendered menu items
     */
   public renderedItems: any[] = [];

    /**
     * the rendered more items
     */
   public moreItems: any[] = [];

    /**
     * inidcvates that an item is moved to the active state
     */
   public movingActive: boolean = false;

    /**
     * indicates that we are in teh rendering and calculation process
     */
   public rendering: boolean = false;


    /**
     * timeout function to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
     */
   public resizeTimeOut: any = undefined;

    constructor(public metadata: metadata,public elementRef: ElementRef,public broadcast: broadcast,public navigation: navigation) {
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

   public buildMenuItems() {
        this.menuItems = [];

        let modules = this.metadata.getRoleModules(true);
        for (let module of modules) {
            this.menuItems.push(module);
        }
    }

   public handleResize() {
        this.buildMenuItems();

        if (this.resizeTimeOut) window.clearTimeout(this.resizeTimeOut);
        this.resizeTimeOut = window.setTimeout(() => this.renderMenu(), 250);
    }

   public checkActiveModule(): boolean {
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

   public destroyMenu() {
        for (let item of this.renderedItems) {
            item.componentRef.destroy();
        }
        this.renderedItems = [];

        this.destroyMoreItem();

        this.movingActive = false;

    }

   public renderMenu() {
        // destroy the current menu
        this.destroyMenu();

        // start adding the first menu item
        this.rendering = true;
        this.addMenuItem(this.menuItems[0], this.menuItems[0]);
    }

   public addMenuItem(module, name) {
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

   public addMoreItem() {
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

   public destroyMoreItem() {
        if (this.moreComponentRef) {
            this.moreComponentRef.componentRef.destroy();
            this.moreComponentRef = undefined;
        }
    }

   public getRenderedWidth() {
        let renderedWidth = 0;
        for (let item of this.renderedItems) {
            renderedWidth += item.width;
        }

        return renderedWidth;
    }

   public handleMessage(message) {
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
