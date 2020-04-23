/**
 * @module SpiceInstallerModule
 */

import {Component, EventEmitter, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {spiceinstaller} from "../services/spiceinstaller.service";





@Component({
    selector: 'spice-installer-detail-container',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerdetailcontainer.html',
})

export class SpiceInstallerDetailContainer {

private currentStepIndex: string = '';
    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller,

    ) {

    }

    /**
     * takes the index of the current step, removes it and sets the next step in the array visible
     * @param currentStep
     */
    private next(currentStep) {
        let nextStep = currentStep + 1;
        if(nextStep < this.spiceinstaller.steps.length && this.spiceinstaller.steps[currentStep].completed) {
            this.spiceinstaller.steps[currentStep].visible = false;
            this.spiceinstaller.steps[nextStep].visible = true;
        }
    }

    private previous(currentStep) {
        let previousStep = currentStep - 1;
        if(previousStep < this.spiceinstaller.steps.length) {
            this.spiceinstaller.steps[currentStep].visible = false;
            this.spiceinstaller.steps[previousStep].visible = true;
        }
    }

}
