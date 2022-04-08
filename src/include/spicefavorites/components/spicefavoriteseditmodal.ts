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
    templateUrl: '../templates/spicefavoriteseditmodal.html'
})
export class SpiceFavoritesEditModal {

    /**
     * reference to self for the closure of the modal
     */
    public self: any;

    constructor(
        public favorite: favorite,
        public language: language
    ) {
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

}
