/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    Component, ElementRef, OnDestroy,
    OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {session} from '../../services/session.service';
import {Subscription} from "rxjs";

/**
 * renders a tabcontainer with separate tabs
 */
@Component({
    selector: 'object-tab-container',
    templateUrl: '../templates/objecttabcontainer.html'
})
export class ObjectTabContainer implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('maintabs', {read: ViewContainerRef}) public maintabs: QueryList<any>;
    @ViewChildren('moretabs', {read: ViewContainerRef}) public moretabs: QueryList<any>;

    @ViewChild('moretab', {read: ViewContainerRef, static: false}) public moretab: ViewContainerRef;

    public resizeListener: any;
    public moreOpen: boolean = false;
    private subscription = new Subscription();

    /**
     * the index of the active tab
     */
    public activeTab: number = 0;

    /**
     * holds which tabs have been activated. Since they are only rnedered when clicked or set to forcerender
     */
    public activatedTabs: number[] = [0];

    /**
     * the componentconfig
     */
    public componentconfig: any;

    /**
     * all items
     */
    public items: any[] = [];

    /**
     * the tabs to be rendered
     */
    public tabs: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        protected session: session) {

        this.resizeListener = this.renderer.listen('window', 'resize', e => {
            this.handleOverflow();
        });

    }

    /**
     * loads the tabs
     */
    public ngOnInit() {
        this.buildTabs();

        this.subscription.add(
            this.model.loaded$.subscribe({
                next: (loaded) => {
                    if(loaded){
                        this.handleOverflow();
                    }
                }
            })
        )
    }

    /**
     * unsubscribe and destroy the resizelistener
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
        this.resizeListener();
    }

    /**
     * builds the tabs
     *
     * @private
     */
    private buildTabs(){
        // reset the tabs
        this.tabs = [];
        // empty items aray
        this.items = [];

        // get the items from teh config
        if (this.componentconfig && this.componentconfig.componentset) {
            this.items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
        } else {
            let componentconfig = this.metadata.getComponentConfig('ObjectTabContainer', this.model.module);
            this.items = this.metadata.getComponentSetObjects(componentconfig.componentset);
        }

        // iterate over the items
        for (let item of this.items) {
            // check if the tab is admin access only
            if ((item.componentconfig.adminonly && !this.session.isAdmin)) continue;
            let cItem = {...item.componentconfig};
            cItem.tabid = item.id;
            this.tabs.push(cItem);
        }
    }

    /**
     * handle overflow after we initially rendered
     */
    public ngAfterViewInit(): void {
        this.handleOverflow();
    }

    /**
     * returns if the item is hideden
     * @param itemconfig
     */
    public isHidden(itemconfig){
        // check that we have acl access
        if(itemconfig.acl && !this.model.checkAccess(itemconfig.acl)) return true;

        // check that we have mode state access
        if(itemconfig.requiredmodelstate && !this.model.checkModelState(itemconfig.requiredmodelstate)) return true;

        return false;
    }

    /**
     * chanmge teh active tab and render it
     * @param index
     */
    public setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /**
     * checks if the tab is to be rendered or forced to be rendered. If not is will be (by ngIf only be rendered when the tab is selected
     * @param tabindex
     */
    public checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1 || (this.tabs && this.tabs[tabindex].forcerender);
    }

    get moreactive() {
        return false; //this.moreModules.indexOf(this.activeTab) >= 0;
    }

    public toggleOpen() {
        this.moreOpen = !this.moreOpen;
    }

    public handleOverflow() {

        // make sure we set all to hidden
        this.maintabs.forEach(thisitem => {
            thisitem.element.nativeElement.classList.remove('slds-hide');
            thisitem.element.nativeElement.classList.add('slds-hidden');
        });
        this.moretab.element.nativeElement.classList.add('slds-hidden');
        this.moretab.element.nativeElement.classList.remove('slds-hide');

        // get the total width and the more tab with
        let totalwidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        let morewidth = this.moretab.element.nativeElement.getBoundingClientRect().width;
        let showmore = false;

        let moreTabIds = [];

        let usedWidth = 0;
        this.maintabs.forEach((thisitem) => {
            // check if the tab is to be hidden in any case
            let item = this.items.find(i => i.id == thisitem.element.nativeElement.attributes.getNamedItem('data-tabid').value);
            if(this.isHidden(item.componentconfig)){
                thisitem.element.nativeElement.classList.add('slds-hide');
            } else {
                let itemwidth = thisitem.element.nativeElement.getBoundingClientRect().width;
                usedWidth += itemwidth;
                if (showmore || usedWidth > totalwidth - morewidth) {
                    thisitem.element.nativeElement.classList.add('slds-hide');
                    moreTabIds.push(thisitem.element.nativeElement.attributes.getNamedItem('data-tabid').value);
                    showmore = true;
                }
                thisitem.element.nativeElement.classList.remove('slds-hidden');
            }
        });

        // handle the more element hidden attribute
        if (showmore) {
            this.moretab.element.nativeElement.classList.remove('slds-hidden');

            this.moretabs.forEach(moreitem => {
                if (moreTabIds.indexOf(moreitem.element.nativeElement.attributes.getNamedItem('data-tabid').value) >= 0) {
                    moreitem.element.nativeElement.classList.remove('slds-hide');
                } else {
                    moreitem.element.nativeElement.classList.add('slds-hide');
                }
            });

        } else {
            this.moretab.element.nativeElement.classList.remove('slds-hidden');
            this.moretab.element.nativeElement.classList.add('slds-hide');
        }

    }
}
