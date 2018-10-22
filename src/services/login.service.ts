import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';

import {configurationService} from './configuration.service';
import {loader} from './loader.service';
import {session} from './session.service';
import {toast} from './toast.service';
import {userpreferences} from './userpreferences.service';


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

    public oauthToken: string = '';
    public accessToken: string = '';
    public loginSuccessful: Subject<boolean> = new Subject<boolean>();

    constructor(
        private configurationService: configurationService,
        private http: HttpClient,
        private router: Router,
        private loader: loader,
        private toast: toast,
        private session: session,
        private userprefs: userpreferences
    ) {}

    public login(): Observable<boolean> {
        // make sure we invalidate a session id cookie that might still be around
        // document.cookie = 'PHPSESSID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        let krestUrl: string = "";
        let options: object = {};
        let loginBy: string;
        if (this.authData.userName.length >0 && this.authData.password.length > 0) {
            let asUsernamePos: number;
            if (( asUsernamePos = this.authData.userName.indexOf('#as#')) > -1 ) {
                loginBy = this.authData.userName.slice( 0, asUsernamePos );
                this.authData.userName = this.authData.userName.slice( asUsernamePos+4 );
            }
            let headers = new HttpHeaders();
            headers = headers.set(
                'Authorization',
                'Basic ' + btoa(this.authData.userName+':'+ this.authData.password)
            );

            krestUrl = this.configurationService.getBackendUrl() + '/login';
            if ( loginBy ) krestUrl += '?byDev=' + encodeURIComponent( loginBy );
            options  = {headers: headers};
        } else if (this.oauthToken.length > 0) {
            let params = {oauthToken: this.oauthToken, accessToken: this.accessToken};
            krestUrl = this.configurationService.getBackendUrl() + '/google_oauth/token';
            options  = {params: params};
        } else {
            throw new Error('Cannot Log In');
        }

        this.http.get(krestUrl, options)
            .subscribe(
                (res: any) => {
                    if (res.result == false) {
                        this.toast.sendToast('error authenticating', 'error', res.error);
                    }

                    let response = res;
                    this.session.authData.sessionId = response.id;
                    this.session.authData.userId = response.userid;
                    this.session.authData.userName = response.user_name;
                    this.session.authData.first_name = response.first_name;
                    this.session.authData.last_name = response.last_name;
                    this.session.authData.display_name = response.display_name;
                    this.session.authData.email = response.email;
                    this.session.authData.admin = response.admin == 1 ? true : false;
                    this.session.authData.portalOnly = response.portal_only === '1' ? true : false;
                    this.session.authData.renewPass = response.renewPass === '1' ? true : false;
                    sessionStorage['OAuth-Token'] = this.session.authData.sessionId;
                    sessionStorage[btoa(this.session.authData.sessionId + ':backendurl')] =
                        btoa(this.configurationService.getBackendUrl());
                    sessionStorage[btoa(this.session.authData.sessionId + ':siteid')] =
                        btoa(this.configurationService.getSiteId());
                    if (!this.session.authData.renewPass) {
                        this.load();
                    }

                    this.loginSuccessful.next(true);
                    this.loginSuccessful.complete();
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.toast.sendToast('error authenticating', 'error', 'Wrong username and/or password');
                            break;
                    }
                    this.loginSuccessful.next(false);
                    this.loginSuccessful.error('Not logged in');
                });

        return this.loginSuccessful.asObservable();
    }

    public load() {
        this.loader.load().subscribe((val) => this.redirect(val));
    }

    public redirect(val) {
        if (val === true) {
            this.session.authData.loaded = true;

            // clear all toasts
            this.toast.clearAll();

            // see if we came from alogout and go back or go to home
            if (this.redirectUrl) {
                this.router.navigate([this.redirectUrl]);
                this.redirectUrl = '';
            } else {
                this.router.navigate(['/module/Home']);
            }
        }
    }

    public logout() {
        this.http.delete(
            this.configurationService.getBackendUrl() + '/login?session_id=' + this.session.authData.sessionId
        );
        this.session.endSession();
        this.loader.reset();
        this.router.navigate(['/login']);
    }


    // seems to be unused
    /*private getOptionsWithOauthToken() {

        let headers = new HttpHeaders();
        // headers.append('oauth-token', this.authData.access_token);
        let options = new RequestOptions({
            headers: headers
        });
        return options;
    }*/
}

@Injectable()
export class loginCheck implements CanActivate {
    constructor(private login: loginService, private session: session, private router: Router, private loader: loader) {
    }

    canActivate(route, state) {
        if (!this.session || !this.session.authData.sessionId) {
            this.login.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        } else
            return true;
    }
}
