/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstaller.html',
    providers: [spiceinstaller]
})

export class SpiceInstaller {
    private disabled: boolean = false;

    constructor(
        private spiceinstaller: spiceinstaller
    ) {
    }
}
