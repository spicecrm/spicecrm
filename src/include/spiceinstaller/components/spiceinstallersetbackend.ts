/**
 * @module SpiceInstaller
 */

import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-set-backend',
    templateUrl: '../templates/spiceinstallersetbackend.html',
})

export class SpiceInstallerSetBackEnd implements OnInit {
    public checking: boolean = false;
    public apiurl: string = "";
    public apiFound: boolean = false;

    constructor(
        public toast: toast,
        public http: HttpClient,
        public router: Router,
        public configurationService: configurationService,
        public spiceinstaller: spiceinstaller
    ) {
    }

    /**
     * gets the current url and checks if there is an api folder, hides all the properties for the backendconfig object except systemname
     */
    public ngOnInit() {
        let currentUrl = window.location.href;
        this.apiurl = currentUrl.replace("#/install", "api");
    }

    public next(){
        this.spiceinstaller.systemurl = this.apiurl;
        this.spiceinstaller.selectedStep.completed = true;
        this.spiceinstaller.steps[0] = this.spiceinstaller.selectedStep;
        this.spiceinstaller.next(this.spiceinstaller.steps[0]);
    }

    public testConnection() {
        this.checking = true;
        if(!this.apiFound) {
            this.http.get('config/installercheck', {params: {url: btoa(this.spiceinstaller.systemurl)}}).subscribe(
                (res: any) => {
                    let response = res;
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
                            allowForgotPass: this.spiceinstaller.systemallowforgotpass,
                            frontendUrl: this.spiceinstaller.frontendUrl,
                            displayLoginSidebar: this.spiceinstaller.systemloginsidebar
                        };
                        this.spiceinstaller.selectedStep.completed = true;
                        this.spiceinstaller.steps[0] = this.spiceinstaller.selectedStep;
                        this.spiceinstaller.next(this.spiceinstaller.steps[0]);
                    } else {
                        let body = {
                            id: this.spiceinstaller.systemid,
                            display: this.spiceinstaller.systemname,
                            backendUrl: this.spiceinstaller.systemurl,
                            proxy: this.spiceinstaller.systemproxy,
                            developerMode: this.spiceinstaller.systemdevmode,
                            loginProgressBar: this.spiceinstaller.systemloginprogressbar,
                            allowForgotPass: this.spiceinstaller.systemallowforgotpass,
                            frontendUrl: this.spiceinstaller.frontendUrl,
                            displayLoginSidebar: this.spiceinstaller.systemloginsidebar
                        };
                        this.saveConnection(body);
                    }
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            break;
                    }
                });
        } else {
            let body = {
                id: this.spiceinstaller.systemid,
                display: this.spiceinstaller.systemname,
                backendUrl: this.apiurl,
                proxy: false,
                developerMode: this.spiceinstaller.systemdevmode,
                loginProgressBar: this.spiceinstaller.systemloginprogressbar,
                loginSideBar: this.spiceinstaller.systemloginsidebar,
                allowForgotPass: this.spiceinstaller.systemallowforgotpass,
                frontendUrl: this.spiceinstaller.frontendUrl
            }
            this.saveConnection(body);
        }

    }

    public saveConnection(body: object) {
        this.checking = true;
        this.http.post('config/set', body, {}).subscribe(
            (res: any) => {
                let response = res;
                if (response.success == true) {
                    // this.configurationService.setSiteData(response.site);
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
