import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {CanActivate}    from '@angular/router';

import {configurationService} from './configuration.service';
import {loader} from './loader.service';
import {Router}   from '@angular/router';


// Taken from https://github.com/killmenot/webtoolkit.md5

interface authDataIf {
    renewPass: boolean;
    sessionId: string;
    loaded: boolean,
    userId: string;
    userName: string;
    first_name: string;
    last_name: string;
    display_name: string;
    email: string;
    password: string;
    admin: boolean;
    portalOnly: boolean;
    googleToken: string;
}

@Injectable()
export class session {
    authData: authDataIf = {
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
        renewPass: false,
        portalOnly: false,
        googleToken: '',
    };

    footercontainer: any = null;

    // add an observable for the auth data
    private authDataObs: Subject<authDataIf> = new Subject<authDataIf>();
    authDataObs$: Observable<authDataIf> = this.authDataObs.asObservable();

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

    getSessionData(key, returnEmptyObject = true) {
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
            if (returnEmptyObject)
                return {};
            else
                return false
        }
    }

    existsData(key: string) {
        try {
            return (
            sessionStorage[window.btoa(key + this.authData.sessionId)] &&
            sessionStorage[window.btoa(key + this.authData.sessionId)].length > 0);
        } catch (e) {
            return false;
        }
    }

    endSession() {
        this.authData.sessionId = null;
        this.authData.userId = null;
        this.authData.loaded = false;
        this.authData.userName = '';
        this.authData.first_name = '';
        this.authData.last_name = '';
        this.authData.display_name = '';
        this.authData.email = '';
        this.authData.password = '';
        this.authData.admin = false;
        sessionStorage.clear();
    }

    /*
    * getter returs if the logged on user is an admin
     */
    get isAdmin(){
        return this.authData.admin;
    }
}