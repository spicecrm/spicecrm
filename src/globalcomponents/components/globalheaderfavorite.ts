import {Component, Renderer2, ElementRef} from '@angular/core';
import {favorite} from '../../services/favorite.service';
import {language} from '../../services/language.service';
import {popup} from '../../services/popup.service';
import {metadata} from '../../services/metadata.service';
import {NavigationStart, Router} from '@angular/router';

@Component({
    selector: 'global-header-favorite',
    templateUrl: './src/globalcomponents/templates/globalheaderfavorite.html',
    providers: [popup],
    styles: [
        ':host >>> .spicecrm-favorite--inactive svg {fill: transparent; stroke: grey;}',
        ':host >>> .slds-button.spicecrm-favorite--inactive:focus  svg {fill: transparent; stroke: grey;}',
        ':host >>> .slds-button.spicecrm-favorite--inactive:not(:disabled):hover svg {fill: transparent; stroke: #CA1B21;}',
    ]
})
export class GlobalHeaderFavorite {
    private clickListener: any;
    private showFavorites: boolean = false;

    constructor(
        private metadata: metadata,
        private favorite: favorite,
        private router: Router,
        private popup: popup,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private language: language
    ) {
        this.router.events.subscribe((event: any) => {
            if(event instanceof NavigationStart) {
                this.favorite.disable();
            }
        });

        popup.closePopup$.subscribe(close => {
            this.showFavorites = false;
            if(this.clickListener) {
                this.clickListener();
            }
        });
    }

    get canShowFavorites(){
        return this.metadata.getActiveRole().showfavorites && this.metadata.getActiveRole().showfavorites != '0';
    }

    get nofavorites(){
        return this.favorite.favorites.length == 0;
    }

    private isDisabled() {
        return !this.favorite.isEnabled;
    }

    get isfavorite(){
        return this.favorite.isFavorite;
    }

    private getFavoriteActive() {
        if(this.favorite.isFavorite) {
            return 'spicecrm-favorite--active';
        } else {
            return 'spicecrm-favorite--inactive';
        }
    }

    private toggleFavorite() {
        if(this.favorite.isFavorite) {
            this.favorite.deleteFavorite();
        } else {
            this.favorite.setFavorite();
        }
    }

    private toggleFavorites() {
        this.showFavorites = !this.showFavorites;

        if(this.showFavorites) {
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
}
