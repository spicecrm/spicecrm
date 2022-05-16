/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, ElementRef, Renderer2, NgModule, ViewChild,
    ViewContainerRef, OnInit, OnDestroy, ViewChildren, QueryList
} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {recent} from '../../services/recent.service';
import {favorite} from '../../services/favorite.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';
import {metadata} from '../../services/metadata.service';
import {GlobalNavigationMenuItemActionContainer} from "./globalnavigationmenuitemactioncontainer";

interface menuItem {
    module: string;
    name: string;
}


@Component({
    selector: 'global-navigation-menu-item',
    templateUrl: '../templates/globalnavigationmenuitem.html',
    host: {
        '[class.slds-context-bar__item]': 'true',
        '[class.slds-is-active]': 'isActive()'
    },
    providers: [model, view]
})
export class GlobalNavigationMenuItem implements AfterViewInit, OnInit, OnDestroy {


    @ViewChild('menulist', {read: ViewContainerRef, static: true})public menulist: ViewContainerRef;
    @ViewChild('menucontainer', {read: ViewContainerRef, static: true})public menucontainer: ViewContainerRef;

    /**
     * reference to the container item where the indivvidual components can be rendered into dynamically
     */
    @ViewChildren(GlobalNavigationMenuItemActionContainer)public menuItemlist: QueryList<GlobalNavigationMenuItemActionContainer>;

   public clickListener: any;
    @Input()public itemtext: string = 'test';
    @Input()public item: menuItem = {
        module: null,
        name: null
    };

   public isOpen: boolean = false;
   public isInitialized: boolean = false;

   public itemMenu: any[] = [];
   public favorites: any[] = [];
   public menucomponents: any[] = [];

    constructor(public metadata: metadata,
               public language: language,
               public router: Router,
               public elementRef: ElementRef,
               public broadcast: broadcast,
               public navigation: navigation,
               public model: model,
               public view: view,
               public recent: recent,
               public favorite: favorite,
               public renderer: Renderer2) {
        this.view.displayLabels = false;
    }

   public executeMenuItem(id) {
        this.itemMenu.some((item, index) => {
            if (item.id === id) {
                switch (item.action) {
                    case 'add':
                        this.isOpen = false;
                        this.model.addModel();
                        break;
                }
                return true;
            }
        });
    }

   public navigateTo() {
        this.isOpen = false;
        this.router.navigate(['/module/' + this.item.module]);
    }

   public navigateRecent(recentid) {
        this.isOpen = false;
        this.router.navigate(['/module/' + this.item.module + '/' + recentid]);
    }


    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('GlobalNavigationMenuItem', this.item.module);
        if(componentconfig.actionset){
            this.itemMenu = this.metadata.getActionSetItems(componentconfig.actionset);
        } else {
            this.itemMenu = this.metadata.getModuleMenu(this.item.module);
        }
        this.model.module = this.item.module;
    }

   public toggleOpen() {
        if (!this.isInitialized) this.initialize();
        this.isOpen = !this.isOpen;

        // toggle the listener
        if (this.isOpen) {
            this.favorites = this.getFavorites();
            this.buildMenu();
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }


   public initialize() {
        // get recent .. if it is an observable .. wait ..
        if(this.item.module != 'Home') {
            this.recent.getModuleRecent(this.item.module).subscribe(recentItems => {
                this.isInitialized = true;
            });
        } else {
            this.isInitialized = true;
        }
    }

    get recentitems() {
        return this.recent.moduleItems[this.item.module] ? this.recent.moduleItems[this.item.module] : [];
    }

   public getFavorites() {
        return this.favorite.getFavorites(this.item.module);
    }

   public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target) || (this.elementRef.nativeElement.contains(event.target) && this.menulist.element.nativeElement.contains(event.target))) {
            this.isOpen = false;
        }
    }

   public hasMenu() {
        return this.itemMenu.length > 0 || this.metadata.getModuleTrackflag(this.item.module);
    }

   public getMenuLabel(menuitem) {
        return this.language.getLabel(this.item.module, menuitem);
    }

   public isActive(): boolean {
        if (this.navigation.activeModule == this.item.module) {
            return true;
        } else {
            return false;
        }
    }

    public ngAfterViewInit() {
        this.broadcast.broadcastMessage('navigation.itemadded', {
            module: this.item.module,
            width: this.elementRef.nativeElement.offsetWidth
        })

        this.model.module = this.item.module;
    }

   public buildMenu() {
        return true;
        this.destroyMenu();
        for (let menuitem of this.itemMenu) {
            switch (menuitem.action) {
                case 'NEW':
                    if (this.metadata.checkModuleAcl(this.item.module, 'create')) {
                        this.metadata.addComponent('GlobalNavigationMenuItemNew', this.menucontainer).subscribe(item => {
                            this.menucomponents.push(item);
                        });
                    }
                    break;
                case 'ROUTE':
                    this.metadata.addComponent('GlobalNavigationMenuItemRoute', this.menucontainer).subscribe(item => {
                        item.instance.actionconfig = menuitem.actionconfig;
                        this.menucomponents.push(item);
                    });
                    break;
            }
        }
    }

    public ngOnDestroy() {
        this.destroyMenu();
    }

   public destroyMenu() {
        // destroy all components
        for (let component of this.menucomponents) {
            component.destroy();
        }
    }

    /**
     * determines based on the action ID if the component embedded in the container item is disabled
     *
     * @param actionid the action id
     */
   public isDisabled(actionid) {
        if (this.menuItemlist) {
            return this.menuItemlist.find(a => a.id == actionid)?.disabled;
        }
        return false;
    }

    /**
     * determines based on the action ID if the component embedded in the container item is hidden
     *
     * @param actionid the action id
     */
   public isHidden(actionid) {
        if (this.menuItemlist) {
            return this.menuItemlist.find(a => a.id == actionid)?.hidden;
        }
        return false;
    }

    /**
     * propagets the click to the respective item
     * @param actionid
     */
   public propagateclick(actionid) {
        this.menuItemlist.some(actionitem => {
            if (actionitem.id == actionid) {
                if (!actionitem.disabled) actionitem.execute();
                return true;
            }
        });
    }

}
