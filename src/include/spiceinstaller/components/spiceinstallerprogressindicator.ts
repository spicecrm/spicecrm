/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-progress-indicator',
    templateUrl: '../templates/spiceinstallerprogressindicator.html',
})

export class SpiceInstallerProgressIndicator {

    constructor(
        public spiceinstaller: spiceinstaller,
    ) {
    }

    /**
     * passes the clicked step as an object whose component is then rendered in the container
     * @param step
     */
    public render(step) {
        if (step.completed) {
            this.spiceinstaller.selectedStep = step;
        }

    }

}
