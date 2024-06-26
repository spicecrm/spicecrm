/**
 * @module Outlook
 */
import {
    Component, OnInit, ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {loginService} from '../../../services/login.service';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {Md5} from "ts-md5";
import {AuthServiceI, TokenObjectI} from "../../../globalcomponents/interfaces/globalcomponents.interfaces";
import {GlobalLoginOAuth2Button} from "../../../globalcomponents/components/globalloginoauth2button";
import {OAuth2Service} from "../../../services/oauth2.service";
import {Subscription} from "rxjs";

declare var _: any;
declare var Office: any;

/**
 * A component that handles the display of the SpiceCRM login form in the Outlook add-in
 * and the communication with SpiceCRM to confirm the login credentials.
 */
@Component({
    selector: 'outlook-login-pane',
    templateUrl: '../templates/outlookloginpane.html',
    providers: [OAuth2Service]
})
export class OutlookLoginPane {
    /**
     * subscription to unsubscribe
     */
    public subscription = new Subscription();

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

    @ViewChild(GlobalLoginOAuth2Button) private oAuth2Button: GlobalLoginOAuth2Button;

    constructor(
        public router: Router,
        public outlookConfiguration: OutlookConfiguration,
        public modelutilities: modelutilities,
        public loginService: loginService,
        public http: HttpClient,
        public configuration: configurationService,
        public session: session,
        private oauth2Service: OAuth2Service,
    ) {
        this.goToSettings();

        this.subscribeToBroadcast();

        if (!!this.session.authData.sessionId) {
            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', this.session.authData.sessionId);

            this.http.get(this.configuration.getBackendUrl() + '/authentication/login', {
                headers
            }).subscribe({
                next: (res: any) => {
                    let response = res;
                    this.session.authData.sessionId = response.id;
                    this.session.authData.userId = response.userid;
                    this.session.authData.userName = response.user_name;
                    this.session.authData.email = response.email;
                    this.session.authData.admin = response.admin == 1 ? true : false;
                    this.session.authData.dev = response.dev == 1 ? true : false;
                    this.session.authData.user = this.modelutilities.backendModel2spice('Users', response.user);
                    // this.session.authData.renewPass = repsonse.renewPass === '1' ? true : false;

                    // set the backendurl
                    // this.configuration.data.backendUrl = backendurl;

                    this.loginService.load();
                },
                error: (err: any) => {
                    switch (err.status) {
                        case 401:
                        case 503:
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
    public login(token?: { issuer: string, tokenObject: TokenObjectI }) {

        if (!token && !this.username && !this.password) return;

        if (token) {
            this.loginService.authData.userName = null;
            this.loginService.authData.password = null;
            this.loginService.tokenObject = token.tokenObject;
            this.loginService.oauthIssuer = token.issuer;
        } else {
            this.loginService.authData.userName = this.username;
            this.loginService.authData.password = this.password;
        }

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

    public goToSettings() {
        this.promptUser = true;
        // empty credentials saved in office container
        this.outlookConfiguration.username = '';
        this.outlookConfiguration.password = '';
        this.outlookConfiguration.saveSettings();

    }

    /**
     * check for microsoft login service and trigger the login automatically
     * @param service
     */
    public checkForMicrosoftLoginService(service: AuthServiceI[]) {

        const microsoftService: AuthServiceI = service.find(s => s.config.userinfo_endpoint.includes('microsoft'));

        if (!microsoftService) return;

        const url = this.configuration.getBackendUrl() + '/authentication/oauth2/accessToken';

        this.oauth2Service.config = {
            client_id: microsoftService.config.client_id,
            scope: microsoftService.config.scope,
            token_endpoint: microsoftService.config.token_endpoint,
            userinfo_endpoint: microsoftService.config.userinfo_endpoint,
            login_url: microsoftService.config.login_url,
            redirect_uri: microsoftService.config.redirect_uri,
            client_secret: microsoftService.config.client_secret
        };

        this.oauth2Service.codeFlowLogin().subscribe(code => {

            this.http.post(url, {issuer: microsoftService.issuer, code: code}).subscribe(
                (data: {tokenObject: TokenObjectI, profile}) => {

                    this.login({
                        issuer: microsoftService.issuer, tokenObject: data.tokenObject
                    });
                });
        })
    }

    /**
     * subscribe to broadcast to reload the services
     * @private
     */
    private subscribeToBroadcast() {
        this.subscription.add(
            this.configuration.loaded$.subscribe((loaded) => {
                if (!loaded) return;
                const services: AuthServiceI[] = this.configuration.getCapabilityConfig('oauth2');
                this.checkForMicrosoftLoginService(services);
            })
        )
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
