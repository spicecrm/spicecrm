/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, ElementRef
} from '@angular/core';
import {Router} from "@angular/router";
import {metadata} from '../../services/metadata.service';
import {recent} from '../../services/recent.service';
import {language} from '../../services/language.service';
import {favorite} from '../../services/favorite.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';


@Component({
    selector: 'global-navigation-tabbed-menu-modules',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedmenumodules.html',
    host: {
        '[class.slds-context-bar__item]': '1',
        '[class.slds-is-active]': 'isActive',
        '(mouseenter)': 'openMenu()',
        '(mouseleave)': 'closeMenu()'
    }
})
export class GlobalNavigationTabbedMenuModules {


    /**
     * the menu items derived from the role
     */
    private menuItems: string[] = [];

    private isopen: boolean = false;

    private activeModule: string = '';

    constructor(private metadata: metadata, private broadcast: broadcast, private navigation: navigation, private router: Router, private language: language, private recent: recent, private favorite: favorite, private elementRef: ElementRef) {
        this.buildMenuItems();
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

    }

    /**
     * build the menu items based on the role
     */
    private buildMenuItems() {
        this.menuItems = [];

        let modules = this.metadata.getRoleModules(true);
        for (let module of modules) {
            this.menuItems.push(module);
        }
    }

    /**
     * checks if the current tab is the active tab
     */
    get isActive() {
        return this.navigation.activeTab == 'main';
    }

    /**
     * returns the tab with
     */
    get tabWidth() {
        return this.elementRef.nativeElement.getBoundingClientRect().width;
    }

    /**
     * sets the current tab as the active tab
     */
    private setActive() {
        this.navigation.setActiveTab('main');
    }

    get activeModuleVisible() {
        return this.menuItems.find(item => item == this.navModule);
    }

    /**
     * handle the message .. mainly needed to requild the menu when the role is shifted
     *
     * @param message
     */
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
            case 'loader.reloaded':
            case 'loader.primarycompleted':
                this.buildMenuItems();
                break;

        }
    }

    get navModule() {
        return this.navigation.activeModule;
    }

    /**
     * open the list when the mouse enters
     */
    private openMenu() {
        this.isopen = true;

        this.activeModule = this.navigation.activeModule;
    }

    private setActiveModule(event: MouseEvent, module) {
        event.stopPropagation();
        this.activeModule = module;
    }

    /**
     * close when the mouse leaves
     */
    private closeMenu() {
        this.isopen = false;
    }

    private navigateTo(module) {
        this.isopen = false;
        this.router.navigate(['/module/' + module]);
    }


}
