/**
 * @module GlobalComponents
 */
import {Component, Renderer2, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {favorite} from '../../../services/favorite.service';
import {language} from '../../../services/language.service';

/**
 * renders a modal window to manage the favorites
 */
@Component({
    templateUrl: './src/include/spicefavorites/templates/spicefavoriteseditmodal.html'
})
export class SpiceFavoritesEditModal {

    /**
     * reference to self for the closure of the modal
     */
    private self: any;

    constructor(
        private favorite: favorite,
        private language: language
    ) {
    }

    /**
     * closes the modal
     */
    private close() {
        this.self.destroy();
    }

}
