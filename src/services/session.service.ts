/*
SpiceUI 2021.01.001

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
import {Injectable} from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {loggerService} from './logger.service';
import {broadcast} from './broadcast.service';
import { metadata } from './metadata.service';

declare var moment: any;

// Taken from https://github.com/killmenot/webtoolkit.md5

interface authDataIf {
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
    companycode_id: string;
    tenant_id: string;
    tenant_name: string;
    obtainGDPRconsent: boolean;
    canchangepassword: boolean;
}

/**
 * the session service holds relevant session data and also acts as a session data storage container
 */
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
        portalOnly: false,
        googleToken: '',
        userimage: '',
        companycode_id: '',
        tenant_id: '',
        tenant_name: '',
        obtainGDPRconsent: false,
        canchangepassword: false
    };

    /**
     * an object any component can write data into and read data from. Helpful to keep sessiondata
     */
    private sessionData: any = {};


    // public footercontainer: any = null;

    // add an observable for the auth data
    // private authDataObs: Subject<authDataIf> = new Subject<authDataIf>();
    // private authDataObs$: Observable<authDataIf> = this.authDataObs.asObservable();

    constructor( private logger: loggerService, private broadcast: broadcast ) {
        this.logger.setSession(this);
    }

    /**
     * builds the session header for the http requests with the token for the users session on the backend
     */
    public getSessionHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('OAuth-Token', this.authData.sessionId);
        headers = headers.set('OAuth-Issuer', 'SpiceCRM');
        return headers;
    }

    /**
     * stores data for the session
     *
     * @param key a key to identify the setting
     * @param data the data .. any kind of object, string etc
     * @param persistent a boolen flag to indicate it if also shoudl be stored in the browser or if this is heldp non persistent
     */
    public setSessionData(key, data, persistent: boolean = true) {

        this.sessionData[key] = data;

        if (persistent) {
            sessionStorage.setItem(
                window.btoa(key + this.authData.sessionId),
                window.btoa(encodeURIComponent(JSON.stringify(data)))
            );
        }
    }

    /**
     * removes an item from the session
     *
     * @param key
     */
    public clearSessionData(key) {
        sessionStorage.removeItem(key);
    }
    /**
     * returves the stored object
     *
     * @param key the key of the data object to be retrieved
     * @param returnEmptyObject if set to true returns an empty object when no entry is found, otherwise retuns false
     */
    public getSessionData(key, returnEmptyObject = true) {

        // check if we have it in the service
        if (this.sessionData[key]) return this.sessionData[key];

        // otherwisse go and get it
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

    /**
     * checks if the data in the session storage in the browser exists
     */
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

    /**
     * closes the session and removes all sessiondata
     */
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
        this.authData.companycode_id = '';
        this.authData.obtainGDPRconsent = false;
        this.authData.canchangepassword = false;

        this.sessionData = {};

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

    /**
     * The time zone in which all datetime fields should be shown is held in the session object (with the key 'timezone').
     * setTimezone() makes the entry to the session object and informs all broadcast subscribers about the new timezone setting.
     * So they can react, for example changing moment objects.
     *
     * @param timezone Time zone string, for example 'Europe/Vienna'.
     */
    public setTimezone( timezone: string ): void {
        if ( this.getSessionData('timezone') === timezone ) return; // Timezone did not change, nothing to do.
        this.setSessionData('timezone', timezone, false ); // Set timezone ...

        // set the default moment timezon
        moment.tz.setDefault(timezone);

        this.broadcast.broadcastMessage('timezone.changed', timezone ); // ... and tell about the changement.
    }

}
