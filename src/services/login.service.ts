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
 * @module services
 */
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {configurationService} from './configuration.service';
import {loader} from './loader.service';
import {session} from './session.service';
import {toast} from './toast.service';
import {helper} from './helper.service';
import {broadcast} from './broadcast.service';
import {modal} from './modal.service';
import {metadata} from './metadata.service';

interface loginAuthDataIf {
    userName: string;
    password: string;
}

@Injectable()
export class loginService {

    public redirectUrl: string = '';

    public authData: loginAuthDataIf = {
        userName: '',
        password: ''
    };

    /**
     * an oauthToken passed in
     */
    public oauthToken: string = '';

    /**
     * the issuing authority for the OAuth Token
     * to be pased to the login so the handler can identify based on the toekn
     */
    public oauthIssuer: string = '';

    constructor(
        private configurationService: configurationService,
        private http: HttpClient,
        private router: Router,
        private loader: loader,
        private toast: toast,
        private helper: helper,
        public session: session,
        public broadcast: broadcast,
        public modal: modal, public metadata: metadata
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
    public login(): Observable<boolean> {
        let loginSuccess = new Subject<any>();

        let loginUrl: string = this.configurationService.getBackendUrl() + '/login';

        /**
         * the headers to be passed in
         */
        let headers = new HttpHeaders();

        if (this.authData.userName && this.authData.password) {
            /**
             let asUsernamePos: number = this.authData.userName.indexOf('#as#');
             if (asUsernamePos > -1) {
                loginBy = this.authData.userName.slice(0, asUsernamePos);
                this.authData.userName = this.authData.userName.slice(asUsernamePos + 4);
            }
             */

            headers = headers.set(
                'Authorization',
                'Basic ' + this.helper.encodeBase64(this.authData.userName + ':' + this.authData.password)
            );
        } else if (this.oauthToken) {
            headers = headers.set(
                'OAuth-Token',
                this.oauthToken
            );
            headers = headers.set(
                'OAuth-Issuer',
                this.oauthIssuer
            );
        } else {
            throw new Error('Cannot Log In');
        }

        this.http.get(loginUrl, {headers})
            .subscribe(
                (res: any) => {
                    if (res.result == false) {
                        this.toast.sendToast('error authenticating', 'error', res.error);
                    }

                    let response = res;
                    this.session.authData.sessionId = response.id;
                    this.session.authData.userId = response.userid;
                    this.session.authData.companycode_id = response.companycode_id;
                    this.session.authData.tenant_id = response.tenant_id;
                    this.session.authData.tenant_name = response.tenant_name;
                    this.session.authData.userName = response.user_name;
                    this.session.authData.userimage = response.user_image;
                    this.session.authData.first_name = response.first_name;
                    this.session.authData.last_name = response.last_name;
                    this.session.authData.display_name = response.display_name;
                    this.session.authData.email = response.email;
                    this.session.authData.admin = response.admin;
                    this.session.authData.dev = response.dev;
                    this.session.authData.portalOnly = response.portal_only;
                    this.session.authData.googleToken = response.access_token;
                    this.session.authData.obtainGDPRconsent = response.obtainGDPRconsent;
                    this.session.authData.canchangepassword = response.canchangepassword;

                    sessionStorage['OAuth-Token'] = this.session.authData.sessionId;

                    sessionStorage[btoa(this.session.authData.sessionId + ':backendurl')] =
                        btoa(this.configurationService.getBackendUrl());
                    sessionStorage[btoa(this.session.authData.sessionId + ':siteid')] =
                        btoa(this.configurationService.getSiteId());

                    // broadcast that we have a login
                    this.broadcast.broadcastMessage('login');

                    // load the UI
                    this.load();

                    loginSuccess.next(true);
                    loginSuccess.complete();
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            loginSuccess.error(err.error.error);
                            break;
                        default:
                            this.toast.sendToast('Application Error', 'error', 'Error Authenticating');
                            break;
                    }
                    loginSuccess.complete();
                });

        return loginSuccess.asObservable();
    }

    /**
     * logs back into the backend
     */
    public relogin(password, token): Observable<boolean> {
        let loginUrl: string = this.configurationService.getBackendUrl() + '/login';

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
        } else if (token) {
            headers = headers.set(
                'OAuth-Token',
                token
            );
            headers = headers.set(
                'OAuth-Issuer',
                this.oauthIssuer
            );
        }

        this.http.get(loginUrl, {headers})
            .subscribe(
                (res: any) => {
                    let response = res;
                    this.session.authData.sessionId = response.id;

                    sessionStorage['OAuth-Token'] = this.session.authData.sessionId;

                    // resolve the promise
                    loginSuccess.next(true);
                    loginSuccess.complete();

                    // broadcast that we have a relogin
                    this.broadcast.broadcastMessage('relogin');
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            loginSuccess.error(err.error.error);
                            break;
                        default:
                            this.toast.sendToast('Application Error', 'error', 'Error Authenticating');
                            break;
                    }
                    loginSuccess.complete();
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
            this.http.post(renewUrl, {newpwd: newPassword}, {headers}).subscribe(res => {
                // do nmothing
            });
        }
    }

    /**
     * starts the loaded upon successful login
     */
    public load() {
        this.loader.load().subscribe((val) => this.redirect(val));
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
            this.http.delete(
                this.configurationService.getBackendUrl() + '/login?session_id=' + this.session.authData.sessionId
            );
        }
        this.session.endSession();
        this.loader.reset();

        // broadcast that the user loged out
        this.broadcast.broadcastMessage('logout');

        this.router.navigate(['/login']);
    }
}

@Injectable()
export class loginCheck implements CanActivate {
    constructor(private login: loginService, private session: session, private modal: modal, private router: Router, private loader: loader) {
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
