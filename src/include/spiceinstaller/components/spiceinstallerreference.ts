/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-reference',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerreference.html'
})

export class SpiceInstallerReference {
    private configBody: any = {};

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.currentStep(5);
        this.spiceinstaller.configBody$.subscribe(data => {
            this.configBody = data;
        });
    }

    private checkReference() {
        this.http.get(`${this.configBody.backendconfig.backendUrl}/KREST/spiceinstaller/checkreference`).subscribe(result => {
            if (result) {
                this.toast.sendToast('connection reference was successful', 'success');
                this.spiceinstaller.steps[5].completed = true;
            } else {
                this.toast.sendToast('error', "error");
            }
        });
    }

}
