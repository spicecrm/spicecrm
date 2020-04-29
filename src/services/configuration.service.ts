/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';

import {cookie} from './cookie.service';
import {session} from './session.service';
import {broadcast} from './broadcast.service';

import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";

/**
 * @ignore
 */
declare var _: any;

/**
 * holds aplication configuration
 */
@Injectable()
export class configurationService {

    /**
     * set to true once the service loaded itself
     */
    public initialized: boolean = false;

    /**
     * set to true if the sysinfo is getting reloaded
     */
    public reloading: boolean = false;

    /**
     * holds the sites from the frontend config
     */
    public sites: any[] = [];

    /**
     * holds general system data retrieved from sysinfo call
     */
    public data: any = {
        backendUrl: 'proxy',
        backendextensions: {},
        systemparameters: {},
        theme: {}
    };

    /**
     * holds any app data the application can store with a given key
     */
    private appdata: any = {};

    /**
     * emits when the systemparamaters have been laoded
     */
    public loaded$: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * emits when a data with a give key is changed
     */
    public datachanged$: EventEmitter<string> = new EventEmitter<string>();

    constructor(private http: HttpClient,
                private cookie: cookie,
                private session: session,
                private broadcast: broadcast,
                private router: Router,) {

        let storedSites = localStorage.spiceuisites;

        if (storedSites) {
            this.sites = JSON.parse(atob(storedSites));

            let selectedsite = this.cookie.getValue('spiceuibackend');
            let siteFound = false;
            this.sites.some(site => {
                if (site.id == selectedsite) {
                    this.setSiteID(site.id);
                    siteFound = true;
                    return true;
                }
            });

            if (!siteFound) {
                this.setSiteID(this.sites[0].id);
            }

            // subscribe to the broadcast to catch the logout
            this.broadcast.message$.subscribe(message => this.handleLogout(message));
        }

        // Update Theme when configuration has been loaded.
        this.loaded$.subscribe(() => this.updateTheme() );

        // reload the sites
        http.get('config/sites/')
            .subscribe(
                (data: any) => {

                    let dataObject = data;
                    let sites = dataObject.sites;

                    // if no site is set naviogate to setup screen
                    if (sites.length == 0) {
                        this.router.navigate(['/setup']);
                    }

                    for (let attrname in dataObject.general) {
                        this.data[attrname] = dataObject.general[attrname];
                    }

                    // if multiple are set try to find the proper one
                    if (sites.length > 0) {
                        this.sites = sites;

                        // this.session.setSessionData('sites', sites);
                        localStorage.spiceuisites = btoa(JSON.stringify(sites));

                        if (!this.data.id) {
                            let selectedsite = this.cookie.getValue('spiceuibackend');
                            let siteFound = false;
                            this.sites.some(site => {
                                if (site.id == selectedsite) {
                                    this.setSiteID(site.id);
                                    siteFound = true;
                                    return true;
                                }
                            });

                            if (!siteFound) {
                                this.setSiteID(sites[0].id);
                            }
                        }
                    }

                    // this.initialized = true;
                }
            );

    }

    /**
     * handle the message broadcast and if messagetype is logout reset the data
     *
     * @param message the message received
     */
    private handleLogout(message) {
        if (message.messagetype == 'logout') {
            this.reset();
        }
    }

    /**
     * resets the complete app data object
     */
    public reset() {
        this.appdata = {};
    }

    public setSiteData(data) {
        this.sites.push(data);
        for (let attrname in data) {
            this.data[attrname] = data[attrname];
        } // before: this.data = data;
        // this.session.setSessionData('sites', sites);
        localStorage.spiceuisites = btoa(JSON.stringify(this.sites));

        this.getSysinfo();
    }

    public setSiteID(id) {
        this.sites.some(site => {
            if (site.id == id) {
                for (let attrname in site) {
                    this.data[attrname] = site[attrname];
                } // before: this.data = site;
                this.cookie.setValue('spiceuibackend', id);
                return true;
            }
        });
        this.getSysinfo();
        return this.data;
    }

    public getSiteId() {
        return this.data.id;
    }

    public getBackendUrl() {
        return this.data.backendUrl;
    }

    public getFrontendUrl() {
        if (typeof this.data.frontendUrl != "undefined") {
            return this.data.frontendUrl;
        }
        return "";
    }

    public getUser() {
        return this.data.user;
    }

    public getPassword() {
        return this.data.password;
    }

    /**
     * calls sysinfo on the backend and stores the data
     */
    public getSysinfo() {
        this.reloading = true;
        let sysinfo = this.http.get(this.getBackendUrl() + '/sysinfo');
        sysinfo.subscribe(
            (res: any) => {
                if (res) {
                    this.data.languages = res.languages;
                    this.data.backendextensions = res.extensions;
                    this.data.systemparameters = res.systemsettings;
                    this.loaded$.emit(true);
                }
                this.initialized = true;
                this.reloading = false;
            },
            (err: any) => {
                this.reloading = false;
                this.initialized = true;
                // this.toast.sendToast('error connecting to Backend', 'error', 'please contact your System administrator');
            });
        return sysinfo;
    }

    /**
     * returns a specific systemparameter
     *
     * @param parameter
     */
    public getSystemParamater(parameter) {
        try {
            return this.data.systemparameters[parameter];
        } catch (e) {
            return false;
        }
    }

    /**
     * returns if the backend has a specific capability
     *
     * @param capability
     */
    public checkCapability(capability) {
        return this.data.backendextensions && this.data.backendextensions.hasOwnProperty(capability);
    }

    /**
     * returns the configuration for a specific backend extension
     *
     * @param capability
     */
    public getCapabilityConfig(capability) {
        try {
            return (this.data.backendextensions[capability] && this.data.backendextensions[capability].config) ? this.data.backendextensions[capability].config : {};
        } catch (e) {
            return {};
        }
    }

    /**
     * Is there a configuration for a specific backend extension?
     *
     * @param capability
     */
    public hasCapabilityConfig(capability): boolean {
        return this.data.backendextensions[capability] && this.data.backendextensions[capability].config && Object.keys( this.data.backendextensions[capability].config ).length > 0;
    }

    /**
     * sores data ion teh internal key store
     *
     * @param key
     * @param data
     */
    public setData(key, data) {
        this.appdata[key] = data;

        // emit the key
        this.datachanged$.emit(key);
    }

    /**
     * gets the data from the key store
     *
     * @param key
     */
    public getData(key) {
        return this.appdata[key] ? this.appdata[key] : false;
    }

    public updateTheme() {
        if ( this.data.backendextensions.spice_theme && this.data.backendextensions.spice_theme.config ) {
            let theme = this.data.backendextensions.spice_theme.config;
            if ( theme['color-brand-primary'] ) document.documentElement.style.setProperty( '--brand-primary', theme['color-brand-primary'] );
        }
    }

}
