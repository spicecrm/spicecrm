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
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {Md5} from "ts-md5";

declare var _: any;

/**
 * A component that handles the display of the SpiceCRM login form in the Outlook add-in
 * and the communication with SpiceCRM to confirm the login credentials.
 */
@Component({
    selector: 'outlook-login-pane',
    templateUrl: '../templates/outlookloginpane.html'
})
export class OutlookLoginPane {

    public promptUser: boolean = false;
    /**
     * Login user name.
     */
    public username: string = '';
    /**
     * Login password.
     */
    public password: string = '';
    public _selectedlanguage: string = '';
    public selectedsite: string = '';
    /**
     * Previously used UI language.
     */
    public lastSelectedLanguage: string = null;
    /**
     * Show the form to change forgotten password.
     */
    public showForgotPass: boolean = false;

    constructor(
        public router: Router,
        public outlookConfiguration: OutlookConfiguration,

        public loginService: loginService,
        public http: HttpClient,
        public configuration: configurationService,
        public session: session
    ) {
        if (sessionStorage['OAuth-Token'] && sessionStorage['OAuth-Token'].length > 0) {
            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', sessionStorage['OAuth-Token']);

            this.http.get(this.configuration.getBackendUrl() + '/authentication/login', {
                headers
            }).subscribe({
                next: (res: any) => {
                    let repsonse = res;
                    this.session.authData.sessionId = repsonse.id;
                    this.session.authData.userId = repsonse.userid;
                    this.session.authData.userName = repsonse.user_name;
                    this.session.authData.userimage = repsonse.user_image;
                    this.session.authData.first_name = repsonse.first_name;
                    this.session.authData.last_name = repsonse.last_name;
                    this.session.authData.address_country = repsonse.address_country;
                    this.session.authData.display_name = repsonse.display_name;
                    this.session.authData.email = repsonse.email;
                    this.session.authData.admin = repsonse.admin == 1 ? true : false;
                    this.session.authData.dev = repsonse.dev == 1 ? true : false;
                    // this.session.authData.renewPass = repsonse.renewPass === '1' ? true : false;

                    // set the backendurl
                    // this.configuration.data.backendUrl = backendurl;

                    this.loginService.load();
                },
                error: (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.promptUser = true;
                            break;
                    }
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
        this.lastSelectedLanguage = localStorage.getItem('spiceuilanguage');
    }

    /**
     * Triggers the actual login itself.
     */
    public login() {
        if (this.username && this.username.length > 0 && this.password && this.password.length > 0) {
            this.loginService.authData.userName = this.username;
            this.loginService.authData.password = this.password;
            this.loginService.login(true).subscribe({
                next: (res) => {
                    this.outlookConfiguration.username = this.loginService.authData.userName;
                    this.outlookConfiguration.password = this.loginService.authData.password;
                    this.outlookConfiguration.saveSettings();
                },
                error: (err) => {
                    this.goToSettings();
                }
            });
        }
    }

    public goToSettings() {
        this.promptUser = true;
        // empty credentials saved in office container
        this.outlookConfiguration.username = '';
        this.outlookConfiguration.password = '';
        this.outlookConfiguration.saveSettings();

    }
}
