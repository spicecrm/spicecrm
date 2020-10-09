/**
 * @module SpiceInstallerModule
 */

import {Component, Input} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-oci8',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstalleroci8.html'
})

export class SpiceinstallerOCI8 {
    /**
     * inputs from the parent component
     */
    @Input() private hostNameCondition: boolean;
    @Input() private userNameCondition: boolean;
    @Input() private dbNameCondition: boolean;

    constructor(
        private spiceinstaller: spiceinstaller
    ) {

    }


}
