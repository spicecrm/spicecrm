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

/**
 * the module dropdown list in the tabbed navigation
 */
@Component({
    selector: 'global-navigation-tabbed-menu-modules',
    templateUrl: '../templates/globalnavigationtabbedmenumodules.html',
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
   public menuItems: string[] = [];

    /**
     * indicates that the menu is open
     *
     * @private
     */
   public isopen: boolean = false;

    /**
     * the current active module
     *
     * @private
     */
   public activeModule: string = '';

    /**
     * is initialized indicates if we have built tjhe module lis or need to rebuild it
     *
     * @private
     */
   public initialized: boolean = false;

    constructor(public metadata: metadata,public broadcast: broadcast,public navigation: navigation,public router: Router,public language: language,public recent: recent,public favorite: favorite,public elementRef: ElementRef) {
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    /**
     * build the menu items based on the role
     */
   public buildMenuItems() {
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
   public setActive() {
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
   public handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
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
   public openMenu() {
        this.isopen = true;

        // if we are not initialized do this now
        if (!this.initialized) {
            this.buildMenuItems();
            this.initialized = true;
        }

        this.activeModule = this.navigation.activeModule;
    }

   public setActiveModule(event: MouseEvent, module) {
        event.stopPropagation();
        this.activeModule = module;
    }

    /**
     * close when the mouse leaves
     */
   public closeMenu() {
        this.isopen = false;
    }

   public navigateTo(module) {
        this.isopen = false;
        this.router.navigate(['/module/' + module]);
    }
}
