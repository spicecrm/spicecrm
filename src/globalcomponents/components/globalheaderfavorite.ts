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
import {Component, Renderer2, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {favorite} from '../../services/favorite.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {navigation} from '../../services/navigation.service';
import {NavigationStart, Router} from '@angular/router';

@Component({
    selector: 'global-header-favorite',
    templateUrl: './src/globalcomponents/templates/globalheaderfavorite.html'
})
export class GlobalHeaderFavorite {

    /**
     * the reference to the fav button. This is used to blur the button after the fav has been set
     */
    @ViewChild('favbutton', {read: ViewContainerRef, static: false}) private favbutton: ViewContainerRef;

    /**
     * the listener for the dropdown triger. Listens if any click is outside of the element
     */
    private clickListener: any;

    /**
     * a boolean value to be set if the menu with the favorites should be shown
     */
    private showFavorites: boolean = false;

    constructor(
        private metadata: metadata,
        private favorite: favorite,
        private navigation: navigation,
        private router: Router,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private language: language,
        private modal: modal
    ) {
        this.navigation.activeTab$.subscribe(activetab => this.handleNavigationChange());
    }

    get canShowFavorites() {
        return this.metadata.getActiveRole().showfavorites && this.metadata.getActiveRole().showfavorites != '0';
    }

    /**
     * returns if there are no favorites
     */
    get nofavorites() {
        return this.favorite.favorites.length == 0;
    }

    private handleNavigationChange() {
        let activeTab = this.navigation.activeTabObject;
        let routeData = this.metadata.getRouteDetails(activeTab.path.replace('tab/:tabid/', ''));
        if (routeData.path == 'module/:module/:id') {
            this.favorite.enable(activeTab.params.module, activeTab.params.id);
        } else {
            this.favorite.disable();
        }
    }

    /**
     * toggles the favorite and removes the focus from the button
     */
    private toggleFavorite() {
        if (this.favorite.isFavorite) {
            this.favorite.deleteFavorite();
        } else {
            this.favorite.setFavorite();
        }

        // remove the focus from the button
        this.favbutton.element.nativeElement.blur();
    }

    /**
     * closes the favorites dropdown .. fired when the seleciton changes
     */
    private closeFavorites() {
        this.showFavorites = false;
    }

    private toggleFavorites() {
        this.showFavorites = !this.showFavorites;

        if (this.showFavorites) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }

    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showFavorites = false;
            this.clickListener();
        }
    }

    private openEditModal(){
        this.modal.openModal('SpiceFavoritesEditModal');
    }
}
