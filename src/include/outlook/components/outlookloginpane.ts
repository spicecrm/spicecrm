/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module Outlook
 */
import {
    Component, OnInit
} from '@angular/core';
import {Router} from '@angular/router';
import {loginService} from '../../../services/login.service';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {cookie} from '../../../services/cookie.service';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {OutlookConfiguration} from '../services/outlookconfiguration.service';

declare var _: any;

/**
 * A component that handles the display of the SpiceCRM login form in the Outlook add-in
 * and the communication with SpiceCRM to confirm the login credentials.
 */
@Component({
    selector: 'outlook-login-pane',
    templateUrl: './src/include/outlook/templates/outlookloginpane.html'
})
export class OutlookLoginPane {

    private promptUser: boolean = false;
    /**
     * Login user name.
     */
    private username: string = '';
    /**
     * Login password.
     */
    private password: string = '';
    private _selectedlanguage: string = '';
    private selectedsite: string = '';
    /**
     * Previously used UI language.
     */
    private lastSelectedLanguage: string = null;
    /**
     * Show the form to change forgotten password.
     */
    private showForgotPass: boolean = false;

    constructor(
        private router: Router,
        private outlookConfiguration: OutlookConfiguration,

        private loginService: loginService,
        private http: HttpClient,
        private configuration: configurationService,
        private session: session,
        private cookie: cookie
    ) {
        if (sessionStorage['OAuth-Token'] && sessionStorage['OAuth-Token'].length > 0) {
            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', sessionStorage['OAuth-Token']);

            if (sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]) {
                this.configuration.setSiteID(atob(sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]));
            }

            this.http.get(this.configuration.getBackendUrl() + '/login', {
                headers
            }).subscribe(
                (res: any) => {
                    let repsonse = res;
                    this.session.authData.sessionId = repsonse.id;
                    this.session.authData.userId = repsonse.userid;
                    this.session.authData.userName = repsonse.user_name;
                    this.session.authData.userimage = repsonse.user_image;
                    this.session.authData.first_name = repsonse.first_name;
                    this.session.authData.last_name = repsonse.last_name;
                    this.session.authData.display_name = repsonse.display_name;
                    this.session.authData.email = repsonse.email;
                    this.session.authData.admin = repsonse.admin == 1 ? true : false;
                    this.session.authData.dev = repsonse.dev == 1 ? true : false;
                    // this.session.authData.renewPass = repsonse.renewPass === '1' ? true : false;

                    // set the backendurl
                    // this.configuration.data.backendUrl = backendurl;

                    this.loginService.load();
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.promptUser = true;
                            break;
                    }
                });
        } else if (this.outlookConfiguration.hasSettings()) {
            this.username = this.outlookConfiguration.username;
            this.password = this.outlookConfiguration.password;
            this.login();
        } else {
            this.goToSettings();
        }

        // check the last selected language from the Cookie
        this.lastSelectedLanguage = this.cookie.getValue('spiceuilanguage');
    }

    /**
     * Triggers the actual login itself.
     */
    private login() {
        if (this.username && this.username.length > 0 && this.password && this.password.length > 0) {
            this.loginService.authData.userName = this.username;
            this.loginService.authData.password = this.password;
            this.loginService.login().subscribe(
                (res) => {
                    this.outlookConfiguration.username = this.loginService.authData.userName;
                    this.outlookConfiguration.password = this.loginService.authData.password;
                    this.outlookConfiguration.saveSettings();
                },
                (err) => {
                    this.goToSettings();
                }
            );
        }
    }

    private goToSettings() {
        this.promptUser = true;

        this.selectedsite = this.cookie.getValue('spiceuibackend');
        if (this.selectedsite) {
            this.configuration.setSiteID(this.selectedsite);
        }
    }
}
