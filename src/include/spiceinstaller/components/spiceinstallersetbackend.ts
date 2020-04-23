/**
 * @module SpiceInstaller
 */

import {
    Component
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
    selector: 'spice-installer-set-backend',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallersetbackend.html',
})

export class SpiceInstallerSetBackEnd {
    systemid: string = '123';
    systemname: string = 'spicy';
    systemurl: string = 'http://localhost/spicecrm_be_installer';
    systemproxy: number = 0;
    systemdevmode: boolean = true;
    systemloginprogressbar: number = 0;
    systemallowforgotpass: number = 0;

    checking: boolean = false;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.currentStep(0);
    }


    get saveEnabled(){
        return this.systemname != '' && this.systemurl != '' && !this.checking;
    }

    testConnection(){
        this.checking = true;
        this.http.get('config/check', {params: {url: btoa(this.systemurl)} }).subscribe(
            (res : any) => {
                var response = res;
                if(response.success != true){
                    this.toast.sendToast(response.message, 'error');
                    this.checking = false;
                } else if(response.message == "spiceinstaller") {
                    let body = {
                        backendconfig:
                        {id: this.systemid,
                        display: this.systemname,
                        backendUrl: this.systemurl,
                        proxy: this.systemproxy,
                        developerMode: this.systemdevmode,
                        loginProgressBar: this.systemloginprogressbar,
                        allowForgotPass: this.systemallowforgotpass}
                    };
                    this.spiceinstaller.configBody(body);
                    this.spiceinstaller.steps[0].completed = true;
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

    saveConnection(){
        this.checking = true;

        let body = {
            id: this.systemid,
            display: this.systemname,
            backendUrl: this.systemurl,
            proxy: this.systemproxy,
            developerMode: this.systemdevmode,
            loginProgressBar: this.systemloginprogressbar,
            allowForgotPass: this.systemallowforgotpass
        };
        this.http.post('config/set', body, {}).subscribe(
            (res : any) => {
                var response = res;
                if(response.success == true){
                    this.configurationService.setSiteData(response.site);
                   this.router.navigate(['/login']);
                } else {
                    this.checking = false;
                }
            },
            (err: any) => {
                switch (err.status) {
                    case 401:

                        break;
                }
            });
    }
}
