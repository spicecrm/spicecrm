/**
 * @module SpiceInstaller
 */

import {
    Component, OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router} from '@angular/router';
import {loginService} from '../../../services/login.service';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-systemcheck',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallersystemcheck.html',
})

export class SpiceInstallerSystemCheck {
    private configBody: any = {};
    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.currentStep(1);
        this.spiceinstaller.configBody$.subscribe(data => {
            this.configBody = data;
        });
    }


    private checkSystem() {
        this.http.get(`${this.configBody.backendconfig.backendUrl}/KREST/spiceinstaller/check`).subscribe( result => {
            if(result) {
                let check = false;
                for (let i in result) {
                    if(result[i] != true) {
                        this.toast.sendAlert('error in: ' + result[i]);
                    } else {
                       check = true;
                    }
                }
                if(check) {
                    this.toast.sendToast('systemcheck was successful', 'success');
                    this.spiceinstaller.steps[1].completed = true;
                }
            } else {
                this.toast.sendToast('error', "error");
            }
            });
    }

}
