/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-licence',
    templateUrl: '../templates/spiceinstallerlicence.html'
})

export class SpiceInstallerLicence {
    public year: any = new Date();
    public author: string = '';

    constructor(
        public spiceinstaller: spiceinstaller
    ) {

        this.spiceinstaller.steps[2] = this.spiceinstaller.selectedStep;
        this.author = 'SpiceCRM';
        this.year = this.year.getFullYear();
    }


}
