/**
 * @module ModuleGSuite
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {loginService} from '../../../services/login.service';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {libloader} from "../../../services/libloader.service";
import {Md5} from "ts-md5";

declare var gapi;
/**
 * A component that handles the display of the SpiceCRM login form in the GSuite add-in
 * and the communication with SpiceCRM to confirm the login credentials.
 */
@Component({
    selector: 'gsuite-login-pane',
    templateUrl: '../templates/gsuiteloginpane.html'
})
export class GSuiteLoginPane {

    public promptUser: boolean = false;
    /**
     * Login user name.
     */
    public username: string = '';
    /**
     * Login password.
     */
    public password: string = '';
    /**
     * Show the form to change forgotten password.
     */
    public showForgotPass: boolean = false;
    /**
     * save the backend url
     */
    public selectedsite: string = '';
    /**
     * Previously used UI language.
     */
    public lastSelectedLanguage: string = null;
    /**
     * holds the google login scope
     */
    public scope = [
        "profile",
        "email",
        "https://www.googleapis.com/auth/plus.me",
        "https://www.googleapis.com/auth/contacts.readonly",
        "https://www.googleapis.com/auth/admin.directory.user.readonly",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
    ].join(" ");
    /**
     * holds the auth2 script
     */
    public auth2: any;
    /**
     * boolean to enable/disable the google login button
     */
    public disabled: boolean = true;
    /**
     * boolean to show/hide google login button
     */
    public googleLoginVisible: boolean = false;

    constructor(
        public router: Router,
        public loginService: loginService,
        public http: HttpClient,
        public configuration: configurationService,
        public session: session,
        public libloader: libloader
    ) {
        this.configuration.loaded$.subscribe(loaded => {
            if(loaded) this.googleInit();
        });
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
                    this.session.authData.admin = repsonse.admin == 1;
                    this.session.authData.dev = repsonse.dev == 1;

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
            this.loginService.login().subscribe(
                () => {
                    // todo handle login
                },
                () => {
                    this.goToSettings();
                }
            );
        }
    }

    /**
     * load google auth
     */
    public googleInit() {
        if (this.configuration.data.backendextensions.hasOwnProperty("google_oauth") &&
            this.configuration.data.backendextensions.google_oauth.config != null) {

            this.libloader.loadFromSource(["https://apis.google.com/js/api.js", "https://apis.google.com/js/platform.js"]).subscribe(
                () => {
                    gapi.load("auth2", () => {
                        const authConfig = {
                            client_id: this.configuration.data.backendextensions.google_oauth.config.clientid,
                            cookiepolicy: 'single_host_origin',
                            scope: this.scope
                        };

                        this.auth2 = gapi.auth2.init(authConfig);
                        this.googleLoginVisible = true;
                        this.disabled = false;
                    });
                },
                () => {
                    this.disabled = true;
                    window.console.error('Error loading Google Libs');
                });
        } else {
            this.googleLoginVisible = false;
        }
    }

    /**
     * go to setting
     */
    public goToSettings() {
        this.promptUser = true;

        let siteHash = Md5.hashStr('spiceuibackend' + window.location.origin + window.location.pathname).toString();
        let selectedsite = sessionStorage.getItem(siteHash);
        if (this.selectedsite) {
            this.configuration.setSiteID(this.selectedsite);
        }
    }

    /**
     * authenticate the user by google and continue login
     * @param event
     */
    public googleSignInClick(event) {
        event.preventDefault();
        event.stopPropagation();
        Promise.resolve(this.auth2.signIn())
            .then((googleUser) => {
                let user_token = googleUser.getAuthResponse().id_token;
                let access_token = googleUser.getAuthResponse().access_token;
                this.loginService.oauthToken = user_token;
                this.loginService.authData.userName = "";
                this.loginService.authData.password = "";
                // this.session.authData.sessionId = user_token;
                this.loginService.login();
            })
            .catch((error: { error: string }) => {
                window.console.error(JSON.stringify(error, undefined, 2));
            });
    }

}
