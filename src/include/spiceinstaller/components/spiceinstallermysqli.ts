/**
 * @module SpiceInstallerModule
 */

import {Component, Input} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-mysqli',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallermysqli.html'
})

export class SpiceinstallerMySQLi {
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
