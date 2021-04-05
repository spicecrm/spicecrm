/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/globalcomponents/templates/globalnavigationcompact.html',
    providers: [model]
})
export class GlobalNavigationCompact implements AfterViewInit, OnDestroy {

    // timeout funciton to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
    @ViewChild('containermiddle', {read: ViewContainerRef, static: true}) private containermiddle: ViewContainerRef;
    @ViewChild('containerbottom', {read: ViewContainerRef, static: true}) private containerbottom: ViewContainerRef;
    @ViewChild('menucontainer', {read: ViewContainerRef, static: true}) private menucontainer: ViewContainerRef;

    private showmenu: boolean = false;
    public menuitems: any[] = [];
    public activeItem: string = '';
    public activeItemMenu: any[] = [];
    private activeItemMenucomponents: any[] = [];
    private subscriptions: Subscription = new Subscription();

    constructor(
        private metadata: metadata,
        private language: language,
        private loginService: loginService,
        private navigation: navigation,
        private favorite: favorite,
        private model: model,
        private recent: recent,
        private session: session,
        private modal: modal,
        private cdr: ChangeDetectorRef,
        private broadcast: broadcast,
        private router: Router) {

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

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
            case 'loader.reloaded':
                this.buildMenuItems();
                break;
        }
    }

    private navigateTo(module) {
        this.router.navigate(['/module/' + module]);
        this.showmenu = false;
    }

    private buildMenuItems() {
        this.menuitems = [];

        let modules = this.metadata.getRoleModules(true);
        for (let module of modules) {
            this.menuitems.push(module);
        }
    }

    private buildModuleMenuItems() {

        this.activeItem = this.navigation.activeModule;

        this.destroyActiveItemMenu();
        this.activeItemMenu = [];

        if (this.activeItemIsModule && this.menucontainer) {
            this.model.module = this.activeItem;
            this.activeItemMenu = this.metadata.getModuleMenu(this.activeItem);
            this.buildActiveItemMenu();
        }
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

    private closeMenu() {
        this.showmenu = false;
    }

    private logout() {
        this.loginService.logout();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private buildActiveItemMenu() {
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

    private destroyActiveItemMenu() {
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
