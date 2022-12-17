/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";


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
    public jump( step) {
        if ( step === this.spiceinstaller.selectedStep ) return;
        if ( !this.spiceinstaller.selectedStep.completed && step.pos > this.spiceinstaller.selectedStep.pos ) return;
        this.spiceinstaller.jumpSubject.next({ from: this.spiceinstaller.selectedStep, to: step });
    }

    public isCurrentStep( step: stepObject ): boolean {
        return step === this.spiceinstaller.selectedStep;
    }
}
