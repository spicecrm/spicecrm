/**
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {environment} from "../../../environments/environment";

/**
 * renders the copyright / version notice
 */
@Component({
    selector: 'global-copyright',
    templateUrl: '../templates/globalcopyright.html'
})
export class GlobalCopyright {
    /**
     * holds the build number
     */
    public buildNumber: string = '';
    /**
     * holds the aacService text
     */
    public copyright: string = '';

    constructor() {
        this.buildNumber = environment.buildNumber;
        this.copyright = environment.copyright;
    }
}
