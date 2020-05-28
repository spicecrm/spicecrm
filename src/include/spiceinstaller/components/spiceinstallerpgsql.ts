/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-pgsql',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerpgsql.html'
})

export class SpiceinstallerPostgreSQL {

    constructor(
        private spiceinstaller: spiceinstaller
    ) {

    }


}
