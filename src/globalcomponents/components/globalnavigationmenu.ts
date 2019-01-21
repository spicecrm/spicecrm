import {
    AfterViewInit, AfterViewChecked, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef
} from '@angular/core';
import {MenuService} from '../services/menu.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'global-navigation-menu',
    templateUrl: './src/globalcomponents/templates/globalnavigationmenu.html',
    providers: [MenuService],
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalNavigationMenu implements AfterViewInit {
    @ViewChild('menucontainer', {read: ViewContainerRef}) private menucontainer: ViewContainerRef;
    @ViewChild('morecontainer', {read: ViewContainerRef}) private morecontainer: ViewContainerRef;
    private moreComponentRef: any = undefined;
    private menuItems: any[] = [];

    private renderedItems: any[] = [];
    private moreItems: any[] = [];

    private movingActive: boolean = false;
    private rendering: boolean = false;


    // timeout function to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
    private resizeTimeOut: any = undefined;

    constructor(private menuService: MenuService, private metadata: metadata, private elementRef: ElementRef, private broadcast: broadcast, private navigation: navigation) {
        // menuService.loadModules();

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
            })
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
