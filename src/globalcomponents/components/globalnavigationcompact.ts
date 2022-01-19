/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, AfterViewChecked, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {language} from "../../services/language.service";
import {session} from "../../services/session.service";
import {loginService} from "../../services/login.service";
import {navigation} from "../../services/navigation.service";
import {Router} from "@angular/router";
import {favorite} from "../../services/favorite.service";
import {recent} from "../../services/recent.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Component({
    selector: 'global-navigation-compact',
    templateUrl: '../templates/globalnavigationcompact.html',
    providers: [model]
})
export class GlobalNavigationCompact implements AfterViewInit, OnDestroy {

    // timeout funciton to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
    @ViewChild('containermiddle', {read: ViewContainerRef, static: true})public containermiddle: ViewContainerRef;
    @ViewChild('containerbottom', {read: ViewContainerRef, static: true})public containerbottom: ViewContainerRef;
    @ViewChild('menucontainer', {read: ViewContainerRef, static: true})public menucontainer: ViewContainerRef;

   public showmenu: boolean = false;
    public menuitems: any[] = [];
    public activeItem: string = '';
    public activeItemMenu: any[] = [];
   public activeItemMenucomponents: any[] = [];
   public subscriptions: Subscription = new Subscription();

    constructor(
       public metadata: metadata,
       public language: language,
       public loginService: loginService,
       public navigation: navigation,
       public favorite: favorite,
       public model: model,
       public recent: recent,
       public session: session,
       public modal: modal,
       public cdr: ChangeDetectorRef,
       public broadcast: broadcast,
       public router: Router) {

        // get the menu items
        this.buildMenuItems();

        // subscribe to the changes imn the navigation
        let navigationSubscriber = this.navigation.activeModule$.subscribe(activeModule => this.buildModuleMenuItems());
        this.subscriptions.add(navigationSubscriber);

        let broadcastSubscriber = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
        this.subscriptions.add(broadcastSubscriber);
    }

    get activeItemIsModule() {
        return !!this.metadata.getModuleDefs(this.activeItem);
    }

    set currentlanguage(value) {
        this.language.currentlanguage = value;
        this.language.loadLanguage();
    }

    get currentlanguage() {
        return this.language.currentlanguage;
    }

    get menuItems() {
        return this.menuitems.filter(item => item != this.activeItem);
    }

    get activeRoleName() {
        let role = this.metadata.getActiveRole();
        if (role.label && role.label != '') {
            return this.language.getLabel(role.label);
        } else {
            return this.metadata.getActiveRole().name;
        }
    }

    get containerMiddleStyle() {
        return {
            height: `calc(100vh - ${this.containermiddle.element.nativeElement.offsetTop + this.containerbottom.element.nativeElement.offsetHeight}px)`
        };
    }

    get menuStyle() {
        return {
            'left': this.showmenu ? '0px' : '-250px',
            'box-shadow': this.showmenu ? '5px 0 15px #888' : 'none'
        };
    }

    public ngAfterViewInit(): void {
        // might have been fired while the component was not rendered .. in any case rebuild it
        this.buildModuleMenuItems();
        this.cdr.detectChanges();
    }

   public handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
            case 'loader.reloaded':
                this.buildMenuItems();
                break;
        }
    }

   public navigateTo(module) {
        this.router.navigate(['/module/' + module]);
        this.showmenu = false;
    }

   public buildMenuItems() {
        this.menuitems = [];

        let modules = this.metadata.getRoleModules(true);
        for (let module of modules) {
            this.menuitems.push(module);
        }
    }

   public buildModuleMenuItems() {

        this.activeItem = this.navigation.activeModule;

        this.destroyActiveItemMenu();
        this.activeItemMenu = [];

        if (this.activeItemIsModule && this.menucontainer) {
            this.model.module = this.activeItem;
            this.activeItemMenu = this.metadata.getModuleMenu(this.activeItem);
            this.buildActiveItemMenu();
        }
    }

   public showAppLauncher() {
        this.showmenu = false;
        this.modal.openModal('GlobalAppLauncherDialog');
    }

   public getAvialableLanguages() {
        return this.language.getAvialableLanguages(true);
    }

   public toggleMenu() {
        this.showmenu = !this.showmenu;
    }

   public closeMenu() {
        this.showmenu = false;
    }

   public logout() {
        this.loginService.logout();
    }

   public trackByFn(index, item) {
        return item.id;
    }

   public buildActiveItemMenu() {
        for (let menuitem of this.activeItemMenu) {
            switch (menuitem.action) {
                case 'NEW':
                    if (this.metadata.checkModuleAcl(this.activeItem, 'create')) {
                        this.metadata.addComponent('GlobalNavigationMenuItemNew', this.menucontainer)
                            .pipe(take(1))
                            .subscribe(item => {
                            this.activeItemMenucomponents.push(item);
                        });
                    }
                    break;
                case 'ROUTE':
                    this.metadata.addComponent('GlobalNavigationMenuItemRoute', this.menucontainer)
                        .pipe(take(1))
                        .subscribe(item => {
                        item.instance.actionconfig = menuitem.actionconfig;
                        this.activeItemMenucomponents.push(item);
                    });
                    break;
            }
        }
    }

   public destroyActiveItemMenu() {
        for (let component of this.activeItemMenucomponents) {
            component.destroy();
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.destroyActiveItemMenu();
        this.cdr.detach();
    }
}
