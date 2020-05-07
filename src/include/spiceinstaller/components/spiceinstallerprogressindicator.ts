/**
 * @module SpiceInstaller
 */

import {AfterViewInit, Component, ChangeDetectorRef} from '@angular/core';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-progress-indicator',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerprogressindicator.html',
})

export class SpiceInstallerProgressIndicator implements AfterViewInit{

    constructor(
        private spiceinstaller: spiceinstaller,
        private changeDetector: ChangeDetectorRef
    ) {
    }

    public ngAfterViewInit() {
        this.changeDetector.detectChanges();
    }

    /**
     * passes the clicked step as an object whose component is then rendered in the container
     * @param step
     */
    private render(step) {
        if(step.completed) {
            this.spiceinstaller.selectedStep = step;
        }

    }

}
