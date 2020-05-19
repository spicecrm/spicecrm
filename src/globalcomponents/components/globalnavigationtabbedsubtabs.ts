/**
 * @module GlobalComponents
 */
import {
    AfterViewChecked,
    NgZone,
    AfterViewInit,
    Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {navigation, objectTab} from '../../services/navigation.service';
import {InputNamesRule} from "@angular/cdk/schematics/ng-update/upgrade-rules/input-names-rule";
import {GlobalNavigationTabbedMenuTab} from "./globalnavigationtabbedmenutab";
import {GlobalNavigationTabbedMoreTab} from "./globalnavigationtabbedmoretab";
import {GlobalNavigationTabbedSubtabItem} from "./globalnavigationtabbedsubtabitem";
import {GlobalNavigationTabbedSubTabMoreTab} from "./globalnavigationtabbedsubtabmoretab";
import {Subscription} from "rxjs";

@Component({
    selector: 'global-navigation-tabbed-subtabs',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedsubtabs.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalNavigationTabbedSubtabs implements OnDestroy {

    /**
     * the parent tab object
     */
    @Input() private parenttab: objectTab;

    /**
     * reference to the navigation tabs
     */
    @ViewChildren(GlobalNavigationTabbedSubtabItem) private subMenuTabs: QueryList<GlobalNavigationTabbedSubtabItem>;

    /**
     * reference to the more item
     */
    @ViewChild(GlobalNavigationTabbedSubTabMoreTab) private subMenuMore: GlobalNavigationTabbedSubTabMoreTab;

    /**
     * the component subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    private stable: boolean = true;

    constructor(private metadata: metadata, private language: language, private navigation: navigation, private elementRef: ElementRef, private ngZone: NgZone) {

        this.subscriptions.add(
            this.navigation.objectTabsChange$.subscribe(changed => {
                // little bit of an ugly trick to come after the change detection run
                window.setTimeout(() => {
                    this.handleResize();
                });
            })
        );

        /*
        * ToDo: check if thsi is needed
        */
        /*
        this.subscriptions.add(
            this.ngZone.onStable.subscribe(stable => {
                this.handleResize();
            })
        );
        */
    }

    /**
     * determine the overflow and sizing
     * ToDo: removed because that caused performance issues
     */
    /*
    public ngAfterViewChecked(): void {
        window.setTimeout(() => {
           this.handleResize();
        });
    }
    */

    /**
     * unsubscribe
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns the subtabs
     */
    get subtabs() {
        return this.navigation.getSubTabs(this.parenttab?.id).sort((t1, t2) => {
            if ((t1.pinned && t2.pinned) || (!t1.pinned && !t2.pinned)) return 0;
            if (t1.pinned) return -1;
            if (t2.pinned) return 1;
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
        let totalWidth = window.innerWidth - left;

        // get the width of the more item
        this.subMenuMore.elementRef.nativeElement.classList.remove('slds-hide');
        this.subMenuMore.elementRef.nativeElement.classList.add('slds-hidden');
        this.subMenuMore.moreObjects = [];
        let moreWidth = this.subMenuMore.tabWidth;

        this.subMenuTabs.forEach(thisitem => {
            thisitem.elementRef.nativeElement.classList.remove('slds-hide');
            thisitem.elementRef.nativeElement.classList.add('slds-hidden');
        });

        let usedWidth = 0;
        let showmore = false;
        this.subMenuTabs.forEach((thisItem, itemIndex) => {
            let itemwidth = thisItem.elementRef.nativeElement.getBoundingClientRect().width;
            usedWidth += itemwidth;
            if (showmore || (itemIndex + 1 == this.subMenuTabs.length && usedWidth > totalWidth) || (itemIndex + 1 < this.subMenuTabs.length &&  usedWidth > totalWidth - moreWidth)) {
                // special handling for last element
                // if (showmore || itemIndex + 1 < this.menuTabs.length || itemwidth < moreWidth) {
                thisItem.elementRef.nativeElement.classList.add('slds-hide');
                // this.moreModules.push(thisitem.element.nativeElement.attributes.getNamedItem('data-module').value);
                showmore = true;

                this.subMenuMore.moreObjects.push(thisItem.object);
                // }
            }
            thisItem.elementRef.nativeElement.classList.remove('slds-hidden');
        });

        if (showmore) {
            this.subMenuMore.elementRef.nativeElement.classList.remove('slds-hidden');
        } else {
            this.subMenuMore.elementRef.nativeElement.classList.add('slds-hide');
        }

        return true;
    }

}
