/**
 * @module SpiceInstallerModule
 */

import {Component, Input} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-mysqli',
    templateUrl: '../templates/spiceinstallermysqli.html'
})

export class SpiceinstallerMySQLi {
    /**
     * inputs from the parent component
     */
    @Input() public hostNameCondition: boolean;
    @Input() public userNameCondition: boolean;
    @Input() public dbNameCondition: boolean;

    constructor(
        public spiceinstaller: spiceinstaller
    ) {

    }


}
