/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, ViewChild, ViewContainerRef, ElementRef, ViewChildren, QueryList
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {SystemResizeDirective} from "../../directives/directives/systemresize";
import {GlobalNavigationTabbedMenuModules} from "./globalnavigationtabbedmenumodules";
import {GlobalNavigationTabbedMoreTab} from "./globalnavigationtabbedmoretab";
import {GlobalNavigationTabbedMenuTab} from "./globalnavigationtabbedmenutab";

@Component({
    selector: 'global-navigation-tabbed-menu',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedmenu.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalNavigationTabbedMenu implements AfterViewInit {

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
     * the menu items derived from the role
     */
    private menuItems: any[] = [];


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

        this.navigation.objectTabsChange$.subscribe(changed => {
            // little bit of an ugly trick to come after the change detection run
            window.setTimeout(() => {
                this.handleResize();
            });
        });

    }

    public ngAfterViewInit() {
        // build the internal menu items
        this.buildMenuItems();

    }

    private buildMenuItems() {
        this.menuItems = [];

        let modules = this.metadata.getRoleModules(true);
        for (let module of modules) {
            this.menuItems.push(module);
        }
    }

    /**
     * returns only the main objecttabs
     */
    get objectTabs() {
        return this.navigation.objectTabs.filter(tab => !tab.parentid).sort((t1, t2)=> {
            if((t1.pinned && t2.pinned) || (!t1.pinned && !t2.pinned) ) return 0;
            if(t1.pinned) return -1;
            if(t2.pinned) return 1;
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
     * a handler for the broadcast message
     *
     * catch role changes and reloads
     *
     * @param message
     */
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
            case 'loader.reloaded':
                this.buildMenuItems();

                break;

        }
    }

    private handleResize() {

        // caluclate the width of the various items
        let left = this.elementRef.nativeElement.getBoundingClientRect().left;
        let menuWidth = this.menuModules.tabWidth;
        let totalWidth = window.innerWidth - left - menuWidth;

        // get the width of the more item
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
            if (usedWidth > totalWidth - moreWidth) {
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
        }

        return true;
    }
}
