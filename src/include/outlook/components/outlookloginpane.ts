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
        private session: session
    ) {
        if (sessionStorage['OAuth-Token'] && sessionStorage['OAuth-Token'].length > 0) {
            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', sessionStorage['OAuth-Token']);

            if (sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]) {
                this.configuration.setSiteID(atob(sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]));
            }

            this.http.get(this.configuration.getBackendUrl() + '/authentication/login', {
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
        this.lastSelectedLanguage = localStorage.getItem('spiceuilanguage');
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
        // empty credentials saved in office container
        this.outlookConfiguration.username = '';
        this.outlookConfiguration.password = '';
        this.outlookConfiguration.saveSettings();

        let siteHash = Md5.hashStr('spiceuibackend' + window.location.origin + window.location.pathname).toString();
        let selectedsite = sessionStorage.getItem(siteHash);
        if (this.selectedsite) {
            this.configuration.setSiteID(this.selectedsite);
        }
    }
}
