/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallersetbackend.html',
})

export class SpiceInstallerSetBackEnd implements OnInit {
    private checking: boolean = false;
    private apiurl: string = "";
    private apiFound: boolean = false;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private spiceinstaller: spiceinstaller
    ) {
    }

    /**
     * gets the current url and checks if there is an api folder, hides all the properties for the backendconfig object except systemname
     */
    public ngOnInit() {
        let currentUrl = window.location.href;
        this.apiurl = currentUrl.replace("#/install", "api");
        this.http.get('config/check', {params: {url: btoa(this.apiurl)}}).subscribe(
           (res: any) => {
               if (res.success) {
                   this.apiFound = true;
               }
           },
           (err: any) => {
               switch (err.status) {
                   case 401:
                       break;
               }
               });
    }

    private testConnection() {
        this.checking = true;
        if(!this.apiFound) {
            this.http.get('config/installercheck', {params: {url: btoa(this.spiceinstaller.systemurl)}}).subscribe(
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
                            allowForgotPass: this.spiceinstaller.systemallowforgotpass,
                            frontendUrl: this.spiceinstaller.frontendUrl
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
                            frontendUrl: this.spiceinstaller.frontendUrl
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
                allowForgotPass: this.spiceinstaller.systemallowforgotpass,
                frontendUrl: this.spiceinstaller.frontendUrl
            }
            this.saveConnection(body);
        }

    }

    private saveConnection(body: Object) {
        this.checking = true;
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
