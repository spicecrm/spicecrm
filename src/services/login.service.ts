/**
 * @module services
 */
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {configurationService} from './configuration.service';
import {loader} from './loader.service';
import {session} from './session.service';
import {toast} from './toast.service';
import {helper} from './helper.service';
import {broadcast} from './broadcast.service';
import {modal} from './modal.service';
import {metadata} from './metadata.service';
import {modelutilities} from "./modelutilities.service";
import {backend} from "./backend.service";
import {TokenObjectI} from "../globalcomponents/interfaces/globalcomponents.interfaces";

interface loginAuthDataIf {
    userName: string;
    password: string;
    rememberMe: boolean;
    code2fa?: string;
}

@Injectable({
    providedIn: 'root'
})
export class loginService {

    /**
     * keeps the url we originally come from so in case the user is not authenticate
     * we can then redirect the user to that URL
     */
    public redirectUrl: string = '';

    /**
     * the auth data
     */
    public authData: loginAuthDataIf = {
        userName: '',
        password: '',
        rememberMe: false
    };

    /**
     * an oauthToken passed in
     */
    public tokenObject: TokenObjectI;

    /**
     * the issuing authority for the OAuth Token
     * to be pased to the login so the handler can identify based on the toekn
     */
    public oauthIssuer: string = '';

    constructor(
        public configurationService: configurationService,
        public http: HttpClient,
        public router: Router,
        public loader: loader,
        public toast: toast,
        public helper: helper,
        public session: session,
        public broadcast: broadcast,
        public modelutilities: modelutilities,
        public modal: modal,
        public metadata: metadata,
        public backend: backend
    ) {
        this.broadcast.message$.subscribe((message: any) => {
            if (message.messagetype === 'loader.completed' && message.messagedata === 'loadUserData') {
                if (this.session.authData.obtainGDPRconsent) {
                    this.modal.openModal('GlobalObtainGDPRConsentContainer');
                }
            }
        });
    }

    /**
     * logs into the backend
     */
    public login(refresh: boolean = true): Observable<boolean> {

        // the impersonateion name
        let impersonationUser: string;

        let loginSuccess = new Subject<any>();

        let loginUrl: string = this.configurationService.getBackendUrl() + '/authentication/login';

        /**
         * the headers to be passed in
         */
        let headers = new HttpHeaders();

        if (this.authData.userName && this.authData.password) {

            let asUsernamePos: number = this.authData.userName.indexOf('#as#');
            if (asUsernamePos > -1) {
                impersonationUser = this.authData.userName.slice(0, asUsernamePos);
                this.authData.userName = this.authData.userName.slice(asUsernamePos + 4);
            }

            headers = headers.set(
                'Authorization',
                'Basic ' + this.helper.encodeBase64(this.authData.userName + ':' + this.authData.password)
            );

            if (!!this.authData.code2fa){
                headers = headers.set('code2fa', this.authData.code2fa);
            }

            if (!!this.session.deviceID){
                headers = headers.set('device-id', this.session.deviceID);
            }

        } else if (this.tokenObject) {
            headers = headers.set(
                'OAuth-Token',
                this.tokenObject.access_token
            ).set(
                'OAuth-Issuer',
                this.oauthIssuer
            ).set(
                'OAuth-Refresh-Token',
                this.tokenObject.refresh_token ?? ''
            ).set(
                'OAuth-Token-Valid-Until',
                this.tokenObject.valid_until ?? ''
            );
        } else {
            throw new Error('Cannot Log In');
        }
        let params: any = {};
        if ( impersonationUser ) params.impersonationuser = encodeURIComponent( impersonationUser );
        this.http.get(loginUrl, { headers, params })
            .subscribe({
                next: (res: any) => {
                    if (res.result == false) {
                        this.toast.sendToast('error authenticating', 'error', res.error);
                    }

                    let response = res;
                    this.session.authData.sessionId = response.id;
                    this.session.authData.userId = response.userid;
                    this.session.authData.companycode_id = response.companycode_id;
                    this.session.authData.tenant_id = response.tenant_id;
                    this.session.authData.tenant_name = response.tenant_name;
                    this.session.authData.tenant_accepted_legal_notice = response.tenant_accepted_legal_notice;
                    this.session.authData.tenant_wizard_completed = response.tenant_wizard_completed;
                    this.session.authData.userName = response.user_name;
                    this.session.authData.email = response.email;
                    this.session.authData.admin = response.admin;
                    this.session.authData.dev = response.dev;
                    this.session.authData.portalOnly = response.portal_only;
                    this.session.authData.googleToken = response.access_token;
                    this.session.authData.obtainGDPRconsent = response.obtainGDPRconsent;
                    this.session.authData.canchangepassword = response.canchangepassword;
                    this.session.authData.user = this.modelutilities.backendModel2spice('Users', response.user);

                    this.session.storeToken(this.authData.rememberMe);

                    sessionStorage[btoa(this.session.authData.sessionId + ':backendurl')] =
                        btoa(this.configurationService.getBackendUrl());

                    // broadcast that we have a login
                    this.broadcast.broadcastMessage('login');

                    // load the UI
                    this.load(refresh);

                    loginSuccess.next(true);
                    loginSuccess.complete();
                },
                error: (err: any) => {
                    switch (err.status) {
                        case 401:
                            loginSuccess.error(err.error.error);
                            break;
                        default:
                            this.toast.sendToast('Application Error', 'error', 'Error Authenticating');
                            loginSuccess.error(err.statusText);
                            break;
                    }
                    loginSuccess.complete();
                }
            });

        return loginSuccess.asObservable();
    }

    /**
     * logs back into the backend
     */
    public relogin(password, tokenObject: TokenObjectI): Observable<boolean> {
        let loginUrl: string = this.configurationService.getBackendUrl() + '/authentication/login';

        let loginSuccess = new Subject<boolean>();

        /**
         * the headers to be passed in
         */
        let headers = new HttpHeaders();

        if(password) {
            headers = headers.set(
                'Authorization',
                'Basic ' + this.helper.encodeBase64(this.session.authData.userName + ':' + password)
            );

            if (!!this.authData.code2fa){
                headers = headers.set('code2fa', this.authData.code2fa);
            }

        } else if (tokenObject) {

            headers = headers.set(
                'OAuth-Token',
                tokenObject.access_token
            ).set(
                'OAuth-Issuer',
                this.oauthIssuer
            ).set(
                'OAuth-Refresh-Token',
                this.tokenObject.refresh_token ?? ''
            ).set(
                'OAuth-Token-Valid-Until',
                this.tokenObject.valid_until ?? ''
            );
        }

        this.http.get(loginUrl, {headers})
            .subscribe({
                next: (res: any) => {
                    let response = res;
                    this.session.authData.sessionId = response.id;

                    this.session.storeToken(this.authData.rememberMe);

                    // resolve the promise
                    loginSuccess.next(true);
                    loginSuccess.complete();

                    // broadcast that we have a relogin
                    this.broadcast.broadcastMessage('relogin');
                },
                error: (err: any) => {
                    switch (err.status) {
                        case 401:
                            loginSuccess.error(err.error.error);
                            break;
                        default:
                            this.toast.sendToast('Application Error', 'error', 'Error Authenticating');
                            loginSuccess.error(err.statusText);
                            break;
                    }
                    loginSuccess.complete();
                }
            });
        return loginSuccess.asObservable();
    }

    /**
     * renew the password for the current user
     *
     * @param newPassword
     */
    public renewPassword(newPassword) {
        let renewUrl: string = this.configurationService.getBackendUrl() + '/user/password/change';

        /**
         * the headers to be passed in
         */
        if (this.authData.userName && this.authData.password) {
            let headers = new HttpHeaders();
            headers = headers.set(
                'Authorization',
                'Basic ' + this.helper.encodeBase64(this.authData.userName + ':' + this.authData.password)
            );
            this.http.post(renewUrl, {newpwd: newPassword}, {headers}).subscribe({
                next: res => {
                    // do nmothing
                }
            });
        }
    }

    /**
     * starts the loaded upon successful login
     */
    public load(refresh: boolean = true) {
        this.loader.load(refresh).subscribe((val) => {
            this.redirect(val);
        });
    }

    public redirect(val) {
        if (val === true) {
            this.session.authData.loaded = true;

            // clear all toasts
            this.toast.clearAll();

            // see if we came from a logout and go back or go to home
            if (this.redirectUrl) {
                this.router.navigate([this.redirectUrl]);
                this.redirectUrl = '';
            } else {
                // this.router.navigate(['/module/Home']);
                this.router.navigate(['/']);
            }
        }
    }

    /**
     * logs out from the backend and cleans up all data internally
     * broadcasts a an ebvenmt that sevrices can subscriber and listen to to cleanup and data that might occur
     */
    public logout(localonly: boolean = false) {
        // check if we shoudl also logout on the server
        if(!localonly) {
            this.backend.deleteRequest('authentication/login', {session_id: this.session.authData.sessionId});
        }
        this.session.endSession();
        this.loader.reset();

        // broadcast that the user loged out
        this.broadcast.broadcastMessage('logout');

        this.router.navigate(['/login']);
    }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable({
    providedIn: 'root'
})
export class loginCheck  {
    constructor(public login: loginService, public session: session, public modal: modal, public router: Router, public loader: loader) {
    }

    public canActivate(route, state) {
        if (!this.session || !this.session.authData.sessionId) {
            if (state.url != '/') {
                this.login.redirectUrl = state.url;
            }
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }
}
