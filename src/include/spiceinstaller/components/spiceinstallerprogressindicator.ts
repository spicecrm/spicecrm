/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-progress-indicator',
    templateUrl: '../templates/spiceinstallerprogressindicator.html',
    /*
    styles: [
        ".slds-is-active .slds-progress__marker { box-shadow: 0 0 0 4px #d9d9d9; }"
    ]
    */
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
    public jump( step) {
        this.spiceinstaller.selectedStep.visible = false;
        if ( step.completed || step.prev?.completed ) {
            this.spiceinstaller.selectedStep = step;
            step.visible = true;
        }

    }

}
