/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, ElementRef, Renderer2, HostListener
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
     * add a control-space listener to open the quick launcher
     * @param event
     */
    @HostListener('document:keydown.control.m')quickLaunch(event: KeyboardEvent) {
        this.toggleMenu();
    }

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

    /**
     * reference to the keyboard listener
     *
     * @private
     */
   private keyboardListener: any;

    constructor(
        public metadata: metadata,
        public broadcast: broadcast,
        public navigation: navigation,
        public router: Router,
        public language: language,
        public recent: recent,
        public favorite: favorite,
        public elementRef: ElementRef,
        public renderer: Renderer2
    ) {
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
     * toggles the menu open and close
     *
     * @private
     */
    private toggleMenu(){
       if(this.isopen){
           this.closeMenu();
       } else {
           this.openMenu();
           this.elementRef.nativeElement.focus();
       }
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

        if(!this.keyboardListener) {
            this.keyboardListener = this.renderer.listen('document', 'keyup', (event) => this.handleKeyBoardEvent(event));
        }
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

        // if the keyboard listener is there cancel the listener
        if(this.keyboardListener) {
            this.keyboardListener();
            this.keyboardListener = null;
        }
    }

    private handleKeyBoardEvent(e: KeyboardEvent){
        let i = this.menuItems.indexOf(this.activeModule);
        switch(e.key){
            case 'ArrowDown':
                this.activeModule = this.menuItems[i + 1 >= this.menuItems.length ? 0 : i +1 ];
                break;
            case 'ArrowUp':
                this.activeModule = this.menuItems[i - 1 < 0 ? this.menuItems.length - 1 : i -1];
                break;
            case 'Enter':
                this.navigateTo(this.activeModule);
                break;
        }
    }

   public navigateTo(module) {
        this.closeMenu();
        this.router.navigate(['/module/' + module]);
    }
}
