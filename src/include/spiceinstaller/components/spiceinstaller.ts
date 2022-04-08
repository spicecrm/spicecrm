/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer',
    templateUrl: '../templates/spiceinstaller.html',
    providers: [spiceinstaller]
})

export class SpiceInstaller {

    constructor(
        public spiceinstaller: spiceinstaller
    ) {
    }
}
