/**
 * @module SpiceInstaller
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-set-backend',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallersetbackend.html',
})

export class SpiceInstallerSetBackEnd {


    private checking: boolean = false;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private spiceinstaller: spiceinstaller
    ) {
    }


    private testConnection() {
        this.checking = true;
        this.http.get('config/check', {params: {url: btoa(this.spiceinstaller.systemurl)}}).subscribe(
            (res: any) => {
                var response = res;
                if (response.success != true) {
                    this.toast.sendToast(response.message, 'error');
                    this.checking = false;
                } else if (response.message == "spiceinstaller") {
                    this.spiceinstaller.configObject.backendconfig = {
                        id: this.spiceinstaller.systemid,
                        display: this.spiceinstaller.systemname,
                        backendUrl: this.spiceinstaller.systemurl,
                        proxy: this.spiceinstaller.systemproxy,
                        developerMode: this.spiceinstaller.systemdevmode,
                        loginProgressBar: this.spiceinstaller.systemloginprogressbar,
                        allowForgotPass: this.spiceinstaller.systemallowforgotpass
                    };
                    this.spiceinstaller.selectedStep.completed = true;
                    this.spiceinstaller.steps[0] = this.spiceinstaller.selectedStep;
                    this.spiceinstaller.next(this.spiceinstaller.steps[0]);
                } else {
                    this.saveConnection();
                }
            },
            (err: any) => {
                switch (err.status) {
                    case 401:
                        break;
                }
            });
    }

    private saveConnection() {
        this.checking = true;

        let body = {
            id: this.spiceinstaller.systemid,
            display: this.spiceinstaller.systemname,
            backendUrl: this.spiceinstaller.systemurl,
            proxy: this.spiceinstaller.systemproxy,
            developerMode: this.spiceinstaller.systemdevmode,
            loginProgressBar: this.spiceinstaller.systemloginprogressbar,
            allowForgotPass: this.spiceinstaller.systemallowforgotpass
        };
        this.http.post('config/set', body, {}).subscribe(
            (res: any) => {
                let response = res;
                if (response.success == true) {
                    this.configurationService.setSiteData(response.site);
                    this.router.navigate(['/login']);
                } else {
                    this.checking = false;
                }
            },
            (err: any) => {
                switch (err.status) {
                    case 401:
                        this.toast.sendAlert(err.message, 'error');
                        break;
                    case 500:
                        this.toast.sendAlert(err.message, 'error');
                        break;
                }
            });
    }
}
