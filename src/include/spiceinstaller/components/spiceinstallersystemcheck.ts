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
        this.http.get(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/KREST/spiceinstaller/check`).subscribe(result => {
            this.loading = false;
            if (result) {
                let check = false;
                this.requirements = result;
                for (let i in result) {
                    if (result[i] != true) {
                        check = false;
                    } else {
                        check = true;
                    }
                }
                if (check) {
                    this.spiceinstaller.selectedStep.completed = true;
                    this.spiceinstaller.dbdrivers = this.requirements.dbdrivers;
                }
            } else {
                this.toast.sendToast('error', "error");
            }
        });
    }

}
