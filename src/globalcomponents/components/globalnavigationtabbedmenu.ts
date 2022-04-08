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
    templateUrl: '../templates/globalnavigationtabbedmenu.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalNavigationTabbedMenu implements OnDestroy {

    /**
     * reference to the module menu item
     */
    @ViewChild(GlobalNavigationTabbedMenuModules)public menuModules: GlobalNavigationTabbedMenuModules;

    /**
     * reference to the navigation tabs
     */
    @ViewChildren(GlobalNavigationTabbedMenuTab)public menuTabs: QueryList<GlobalNavigationTabbedMenuTab>;

    /**
     * reference to the more item
     */
    @ViewChild(GlobalNavigationTabbedMoreTab)public menuMore: GlobalNavigationTabbedMoreTab;

    /**
     * reference to the more item
     */
    @ViewChild(GlobalNavigationTabbedBrowser)public menuBrowser: GlobalNavigationTabbedBrowser;

    /**
     * timeout function to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
     */
   public resizeTimeOut: any = undefined;

    /**
     * the component subscriptions
     */
   public subscriptions: Subscription = new Subscription();

    constructor(public metadata: metadata,public elementRef: ElementRef,public broadcast: broadcast,public navigation: navigation) {
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
   public trackByFn(index, item) {
        return item.id;
    }

    /**
     * handle the resize and calculöate the total width as well as overflow
     */
   public handleResize() {

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
