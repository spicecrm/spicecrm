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
    templateUrl: '../templates/globalheaderfavorite.html'
})
export class GlobalHeaderFavorite {

    /**
     * the reference to the fav button. This is used to blur the button after the fav has been set
     */
    @ViewChild('favbutton', {read: ViewContainerRef, static: false})public favbutton: ViewContainerRef;

    /**
     * the listener for the dropdown triger. Listens if any click is outside of the element
     */
   public clickListener: any;

    /**
     * a boolean value to be set if the menu with the favorites should be shown
     */
   public showFavorites: boolean = false;

    constructor(
       public metadata: metadata,
       public favorite: favorite,
       public navigation: navigation,
       public router: Router,
       public renderer: Renderer2,
       public elementRef: ElementRef,
       public language: language,
       public modal: modal
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

   public handleNavigationChange() {
        let activeTab = this.navigation.activeTabObject;
        if (activeTab.id == 'main') {
            return this.favorite.disable();
        }
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
   public toggleFavorite() {
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
   public closeFavorites() {
        this.showFavorites = false;
    }

   public toggleFavorites() {
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

   public openEditModal() {
        this.modal.openModal('SpiceFavoritesEditModal');
    }
}
