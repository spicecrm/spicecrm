/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-licence',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerlicence.html'
})

export class SpiceInstallerLicence {
    private year: any = new Date();
    private author: string = '';

    constructor(
        private spiceinstaller: spiceinstaller
    ) {

        this.spiceinstaller.steps[2] = this.spiceinstaller.selectedStep;
        this.author = 'SpiceCRM';
        this.year = this.year.getFullYear();
    }


}
