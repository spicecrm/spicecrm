/**
 * @module SpiceInstallerModule
 */

import {Component, OnChanges} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstaller.html',
    providers: [spiceinstaller]
})

export class SpiceInstaller {
    private disabled:boolean = false;
    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller
    ) {
    }

    // public nextStep() {
    //     this.spiceinstaller.currentStep$.subscribe(currentStep => {
    //         let nextStep = currentStep + 1;
    //         if (nextStep < this.spiceinstaller.steps.length && this.spiceinstaller.steps[currentStep].completed) {
    //             this.spiceinstaller.steps[currentStep].visible = false;
    //             this.spiceinstaller.steps[nextStep].visible = true;
    //         }
    //
    //     });
    //
    // }
    //
    // public previousStep() {
    //     this.spiceinstaller.currentStep$.subscribe(currentStep => {
    //         let previousStep = currentStep - 1;
    //         if (previousStep < this.spiceinstaller.steps.length) {
    //             this.spiceinstaller.steps[currentStep].visible = false;
    //             this.spiceinstaller.steps[previousStep].visible = true;
    //         }
    //     });
    //
    // }
}
