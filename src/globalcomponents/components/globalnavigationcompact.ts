import {
    AfterViewInit, AfterViewChecked, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef
} from '@angular/core';
import {MenuService} from '../services/menu.service';
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

@Component({
    selector: 'global-navigation-compact',
    templateUrl: './src/globalcomponents/templates/globalnavigationcompact.html',
    providers: [MenuService, model]
})
export class GlobalNavigationCompact {

    // timeout funciton to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
    @ViewChild('containermiddle', {read: ViewContainerRef}) private containermiddle: ViewContainerRef;
    @ViewChild('containerbottom', {read: ViewContainerRef}) private containerbottom: ViewContainerRef;
    @ViewChild('menucontainer', {read: ViewContainerRef}) private menucontainer: ViewContainerRef;

    private showmenu: boolean = false;
    public menuitems: any[] = [];
    public activeItem: string = '';
    public activeItemMenu: any[] = [];
    private activeItemMenucomponents: any[] = [];
    public favorites: any[] = [];
    public recentItems: any[] = [];

    constructor(
        private menuService: MenuService,
        private metadata: metadata,
        private language: language,
        private loginService: loginService,
        private navigation: navigation,
        private favorite: favorite,
        private model: model,
        private recent: recent,
        private session: session,
        private modal: modal,
        private router: Router) {
        this.navigation.activeModule$.subscribe(activeModule => this.buildMenuItems());
    }

    set currentlanguage(value) {
        this.language.currentlanguage = value;
        this.language.loadLanguage();
    }

    get currentlanguage() {
        return this.language.currentlanguage;
    }

    get displayName() {
        return this.session.authData.display_name ? this.session.authData.display_name : this.session.authData.userName;
    }

    get userName() {
        return this.session.authData.userName;
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

    get hasMenu() {
        return this.activeItemMenu.length > 0 || this.metadata.getModuleTrackflag(this.activeItem);
    }

    private navigateTo(module) {
        this.router.navigate(['/module/' + module]);
        this.showmenu = false;
    }

    private buildMenuItems() {
        this.menuitems = ['Home'];

        let modules = this.metadata.getRoleModules(true);
        for (let module of modules) {
            this.menuitems.push(module);
        }
        this.activeItem = this.navigation.activeModule;
        this.model.module = this.activeItem;
        this.reset();

        this.activeItemMenu = this.metadata.getModuleMenu(this.activeItem);
        this.buildActiveItemMenu();
    }

    private reset() {
        this.activeItemMenu = [];
        this.destroyActiveItemMenu();
    }

    private showAppLauncher() {
        this.showmenu = false;
        this.modal.openModal('GlobalAppLauncherDialog');
    }

    private getAvialableLanguages() {
        return this.language.getAvialableLanguages(true);
    }

    private toggleMenu() {
        this.showmenu = !this.showmenu;
    }

    private logout() {
        this.loginService.logout();
    }

    private buildActiveItemMenu() {
        for (let menuitem of this.activeItemMenu) {
            switch (menuitem.action) {
                case 'NEW':
                    if (this.metadata.checkModuleAcl(this.activeItem, 'create')) {
                        this.metadata.addComponent('GlobalNavigationMenuItemNew', this.menucontainer).subscribe(item => {
                            this.activeItemMenucomponents.push(item);
                        });
                    }
                    break;
                case 'ROUTE':
                    this.metadata.addComponent('GlobalNavigationMenuItemRoute', this.menucontainer).subscribe(item => {
                        item.instance.actionconfig = menuitem.actionconfig;
                        this.activeItemMenucomponents.push(item);
                    });
                    break;
            }
        }
    }

    private destroyActiveItemMenu() {
        for (let component of this.activeItemMenucomponents) {
            component.destroy();
        }
    }

    public ngOnDestroy() {
        this.destroyActiveItemMenu();
    }
}
