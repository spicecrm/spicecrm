/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {loggerService} from './logger.service';
import {broadcast} from './broadcast.service';

declare var moment: any;

interface authDataIf {
    sessionId: string;
    loaded: boolean;
    userId: string;
    userName: string;
    email: string;
    admin: boolean;
    dev: boolean;
    portalOnly: boolean;
    googleToken: string;
    companycode_id: string;
    tenant_id: string;
    tenant_name: string;
    tenant_accepted_legal_notice: boolean;
    tenant_wizard_completed: boolean;
    obtainGDPRconsent: boolean;
    canchangepassword: boolean;
    expiringPasswordValidityDays: boolean | number;
    renewPass?: boolean;
    user: any
}

/**
 * the session service holds relevant session data and also acts as a session data storage container
 */
@Injectable()
export class session {

    public authData: authDataIf = {
        tenant_wizard_completed: false,
        tenant_accepted_legal_notice: false,
        sessionId: null,
        loaded: false,
        userId: null,
        userName: '',
        email: '',
        admin: false,
        dev: false,
        portalOnly: false,
        googleToken: '',
        companycode_id: '',
        tenant_id: '',
        tenant_name: '',
        obtainGDPRconsent: false,
        canchangepassword: false,
        expiringPasswordValidityDays: false,
        user: {}
    };

    /**
     * device id to be used for 2fa
     */
    public deviceID;

    /**
     * an object any component can write data into and read data from. Helpful to keep sessiondata
     */
    public sessionData: any = {};

    /**
     * can be set by developers and triggers the developer mode flag to be sent in the header
     */
    public developerMode: boolean = false;

    constructor( public logger: loggerService, public broadcast: broadcast) {
        this.logger.setSession(this);
        this.generateDeviceID();
    }

    /**
     * generate device id for the browser to be used for 2fa
     */
    public generateDeviceID() {

        const storageDeviceId = localStorage.getItem('Device-ID');

        if (!storageDeviceId) {
            this.deviceID = crypto.randomUUID();
            localStorage.setItem('Device-ID', this.deviceID);
        } else {
            this.deviceID = storageDeviceId;
        }
    }

    /**
     * load the tokens from the browser storage
     */
    public loadFromStorage() {
        this.authData.sessionId = sessionStorage.getItem('OAuth-Token') ?? localStorage.getItem('OAuth-Token');
    }

    /**
     * handle access token storage
     * @param rememberMe
     */
    public storeToken(rememberMe: boolean) {

        if (!rememberMe) {
            sessionStorage.setItem('OAuth-Token', this.authData.sessionId);
        } else {
            localStorage.setItem('OAuth-Token', this.authData.sessionId);
        }
    }

    /**
     * builds the session header for the http requests with the token for the users session on the backend
     */
    public getSessionHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('OAuth-Token', this.authData.sessionId);
        headers = headers.set('OAuth-Issuer', 'SpiceCRM');

        // set the developer mode
        if(this.developerMode){
            headers = headers.set('developermode', '1');
        }

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
        this.authData.tenant_id = '';
        this.authData.tenant_name = '';
        this.authData.tenant_accepted_legal_notice = false;
        this.authData.tenant_wizard_completed = false;
        this.authData.sessionId = null;
        this.authData.userId = null;
        this.authData.loaded = false;
        this.authData.userName = '';
        this.authData.email = '';
        this.authData.admin = false;
        this.authData.dev = false;
        this.authData.companycode_id = '';
        this.authData.tenant_id = '';
        this.authData.tenant_name = '';
        this.authData.obtainGDPRconsent = false;
        this.authData.canchangepassword = false;
        this.authData.expiringPasswordValidityDays = false;
        this.authData.user = {};

        this.sessionData = {};

        localStorage.removeItem('OAuth-Token');
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
