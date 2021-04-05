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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    ViewChildren
} from '@angular/core';
import {Router} from "@angular/router";
import {metadata} from '../../services/metadata.service';
import {recent} from '../../services/recent.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {favorite} from '../../services/favorite.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {GlobalNavigationMenuItemActionContainer} from "./globalnavigationmenuitemactioncontainer";


@Component({
    selector: 'global-navigation-tabbed-module-menu',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedmenumodulemenu.html',
    providers: [model],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalNavigationTabbedMenuModuleMenu implements OnChanges {

    /**
     * reference to the container item where the indivvidual components can be rendered into dynamically
     */
    @ViewChildren(GlobalNavigationMenuItemActionContainer) private menuItemlist: QueryList<GlobalNavigationMenuItemActionContainer>;

    /**
     * the module to display the menu for
     */
    @Input() private module: string;

    /**
     * emits if the users select an action or navigates away
     */
    @Output() private actionTriggered: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the menuitems loaded from the compnentconfig
     */
    private itemMenu: any[] = [];

    /**
     * indicator if the recent items are loaded
     */
    private loadingRecent: boolean = false;

    /**
     * the list of recent items for the module
     */
    private recentitems: any[] = [];

    /**
     * the list of favorites for the module
     */
    private favorites: any[] = [];

    constructor(
        private metadata: metadata,
        private model: model,
        private broadcast: broadcast,
        private navigation: navigation,
        private router: Router,
        private language: language,
        private recent: recent,
        private favorite: favorite,
        private cdRef: ChangeDetectorRef
    ) {

    }

    /**
     * set to true when the model is tracking and thus has recent items
     */
    get trackRecent() {
        if (this.module) {
            return this.metadata.getModuleDefs(this.module)?.track == '1';
        }

        return false;
    }

    /**
     * when the module changes reload the menu, recent items and favorites
     */
    public ngOnChanges(): void {
        // set the module
        this.model.module = this.module;

        // get the config and the menu for the module
        let componentconfig = this.metadata.getComponentConfig('GlobalNavigationMenuItem', this.module);
        if (componentconfig.actionset) {
            this.itemMenu = this.metadata.getActionSetItems(componentconfig.actionset);
        } else {
            this.itemMenu = this.metadata.getModuleMenu(this.module);
        }

        // load the recent items
        this.recentitems = [];
        if (this.trackRecent) {
            if (this.recent.moduleItems[this.module]) {
                this.recentitems = this.recent.moduleItems[this.module];
            } else {
                this.loadingRecent = true;
                this.recent.getModuleRecent(this.module).subscribe(
                    loaded => {
                        this.loadingRecent = false;
                        let recentitems = this.recent.moduleItems[this.module];
                        this.recentitems = recentitems ? recentitems : [];
                        this.cdRef.detectChanges();
                    },
                    error => {
                        this.loadingRecent = false;
                    });
            }
        } else {
            this.recentitems = [];
        }

        // load the favorites
        this.favorites = this.favorite.getFavorites(this.module);
    }

    /**
     * propagets the click to the respective item
     * @param actionid
     */
    private propagateclick(actionid) {
        // trigger the click
        this.menuItemlist.find(actionitem => actionitem.id == actionid)?.execute();

        // emit that a click has happened so the menu can be closed
        this.actionTriggered.emit(true);
    }

    /**
     * determines based on the action ID if the component embedded in the container item is disabled
     *
     * @param actionid the action id
     */
    private isDisabled(actionid) {
        let disabled = true;
        if (this.menuItemlist) {
            this.menuItemlist.some((actionitem: any) => {
                if (actionitem.id == actionid) {
                    disabled = actionitem.disabled;
                    return true;
                }
            });
        }
        return disabled;
    }

    /**
     * open a record with the given id from either tha favorites or the recent items
     *
     * @param recentid
     */
    private openRecord(recentid) {
        // route to the record
        this.router.navigate(['/module/' + this.module + '/' + recentid]);

        // emit that a click has happened so the menu can be closed
        this.actionTriggered.emit(true);
    }

}
