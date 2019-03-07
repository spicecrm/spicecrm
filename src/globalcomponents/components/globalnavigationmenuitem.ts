/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, ElementRef, Renderer2, NgModule, ViewChild,
    ViewContainerRef, OnInit, OnDestroy
} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {model} from '../../services/model.service';
import {recent} from '../../services/recent.service';
import {favorite} from '../../services/favorite.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';
import {metadata} from '../../services/metadata.service';

interface menuItem {
    module: string;
    name: string;
}


@Component({
    selector: 'global-navigation-menu-item',
    templateUrl: './src/globalcomponents/templates/globalnavigationmenuitem.html',
    host: {
        '[class.slds-context-bar__item]': 'true',
        '[class.slds-is-active]': 'isActive()',
    },
    providers: [model]
})
export class GlobalNavigationMenuItem implements AfterViewInit, OnInit, OnDestroy {


    @ViewChild('menulist', {read: ViewContainerRef}) private menulist: ViewContainerRef;
    @ViewChild('menucontainer', {read: ViewContainerRef}) private menucontainer: ViewContainerRef;

    private clickListener: any;
    @Input() private itemtext: string = 'test';
    @Input() private item: menuItem = {
        module: null,
        name: null
    };

    private isOpen: boolean = false;
    private isInitialized: boolean = false;

    private itemMenu: any[] = [];
    private favorites: any[] = [];
    private menucomponents: any[] = [];

    constructor(private metadata: metadata,
                private language: language,
                private router: Router,
                private elementRef: ElementRef,
                private broadcast: broadcast,
                private navigation: navigation,
                private model: model,
                private recent: recent,
                private favorite: favorite,
                private renderer: Renderer2) {
    }

    private executeMenuItem(id) {
        this.itemMenu.some((item, index) => {
            if (item.id === id) {
                switch (item.action) {
                    case 'add':
                        this.isOpen = false;
                        this.model.addModel();
                        break;
                }
                return true
            }
        });
    }

    private navigateTo() {
        this.isOpen = false;
        this.router.navigate(['/module/' + this.item.module]);
    }

    private navigateRecent(recentid) {
        this.isOpen = false;
        this.router.navigate(['/module/' + this.item.module + '/' + recentid]);
    }


    public ngOnInit() {
        this.itemMenu = this.metadata.getModuleMenu(this.item.module);
        this.model.module = this.item.module;
    }

    private toggleOpen() {
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


    private initialize() {
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

    private getFavorites() {
        return this.favorite.getFavorites(this.item.module);
    }

    private onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target) || (this.elementRef.nativeElement.contains(event.target) && this.menulist.element.nativeElement.contains(event.target))) {
            this.isOpen = false;
        }
    }

    private hasMenu() {
        return this.itemMenu.length > 0 || this.metadata.getModuleTrackflag(this.item.module);
    }

    private getMenuLabel(menuitem) {
        return this.language.getLabel(this.item.module, menuitem);
    }

    private isActive(): boolean {
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

    private buildMenu() {
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

    private destroyMenu() {
        // destroy all components
        for (let component of this.menucomponents) {
            component.destroy();
        }
    }

}
