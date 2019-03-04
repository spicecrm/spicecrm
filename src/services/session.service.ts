/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {loggerService} from './logger.service';

// Taken from https://github.com/killmenot/webtoolkit.md5

interface authDataIf {
    renewPass: boolean;
    sessionId: string;
    loaded: boolean;
    userId: string;
    userName: string;
    first_name: string;
    last_name: string;
    display_name: string;
    email: string;
    password: string;
    admin: boolean;
    dev: boolean;
    portalOnly: boolean;
    googleToken: string;
    userimage: string;
}

@Injectable()
export class session {

    public authData: authDataIf = {
        sessionId: null,
        loaded: false,
        userId: null,
        userName: '',
        first_name: '',
        last_name: '',
        display_name: '',
        email: '',
        password: '',
        admin: false,
        dev: false,
        renewPass: false,
        portalOnly: false,
        googleToken: '',
        userimage: ''
    };

    public footercontainer: any = null;

    // add an observable for the auth data
    private authDataObs: Subject<authDataIf> = new Subject<authDataIf>();
    private authDataObs$: Observable<authDataIf> = this.authDataObs.asObservable();

    constructor( private logger: loggerService ) {
        this.logger.setSession( this );
    }

    public getSessionHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('OAuth-Token', this.authData.sessionId);
        return headers;
    }

    public setSessionData(key, data) {
        sessionStorage.setItem(
            window.btoa(key + this.authData.sessionId),
            window.btoa(encodeURIComponent(JSON.stringify(data)))
        );
    }

    public getSessionData(key, returnEmptyObject = true) {
        try {
            return JSON.parse(
                decodeURIComponent(
                    window.atob(
                        sessionStorage.getItem(
                            window.btoa(key + this.authData.sessionId)
                        )
                    )
                )
            );
        } catch (e) {
            if (returnEmptyObject) return {};
            else return false;
        }
    }

    public existsData(key: string) {
        try {
            return (
                sessionStorage[window.btoa(key + this.authData.sessionId)] &&
                sessionStorage[window.btoa(key + this.authData.sessionId)].length > 0
            );
        } catch (e) {
            return false;
        }
    }

    public endSession() {
        this.authData.sessionId = null;
        this.authData.userId = null;
        this.authData.loaded = false;
        this.authData.userName = '';
        this.authData.first_name = '';
        this.authData.last_name = '';
        this.authData.display_name = '';
        this.authData.email = '';
        this.authData.userimage = '';
        this.authData.password = '';
        this.authData.admin = false;
        this.authData.dev = false;
        sessionStorage.clear();
    }

    /*
    * getter returns if the logged on user is an admin
     */
    get isAdmin() {
        return this.authData.admin;
    }

    /*
     * getter returns if the logged on user is a developer
     */
    get isDev() {
        return this.authData.dev;
    }

}
