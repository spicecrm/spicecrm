/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-systemcheck',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallersystemcheck.html',
})

export class SpiceInstallerSystemCheck {
    private loading: boolean = false;
    private requirements: any = [];

    constructor(
        private toast: toast,
        private http: HttpClient,
        private spiceinstaller: spiceinstaller
    ) {

        this.checkSystem();
    }


    private checkSystem() {
        this.loading = true;
        this.http.get(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/install/check`).subscribe((response: any) => {
            this.loading = false;
            let result = response;
            this.requirements = result.requirements;
            if (result.success) {
                this.spiceinstaller.selectedStep.completed = true;
                this.spiceinstaller.dbdrivers = this.requirements.dbdrivers;
            } else {
                this.toast.sendToast('error, missing requirements', "error");
            }
        },(err: any) => {
            this.loading = false;
            switch (err.status) {
                case 500:
                    this.toast.sendAlert(err.message, 'error');
                    break;
            }
        });
    }

}
