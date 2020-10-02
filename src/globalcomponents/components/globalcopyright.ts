/**
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';

/**
 * renders the copyright / version notice
 */
@Component({
    selector: 'global-copyright',
    templateUrl: 'copyright.html'
})
export class GlobalCopyright {

    constructor() {
        // just load template
    }
}
