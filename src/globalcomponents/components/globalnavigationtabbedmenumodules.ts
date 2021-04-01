/*
SpiceUI 2018.10.001

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
