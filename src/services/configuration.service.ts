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

@Injectable()
export class configurationService {
    public initialized: boolean = false;
    public sites: any[] = [];
    public data: any = {
        backendUrl: 'proxy',
        backendextensions: {},
        systemparameters: {}
    };

    /**
     * holds any app data the application can store with a given key
     */
    private appdata: any = {};

    public loaded$: EventEmitter<boolean> = new EventEmitter<boolean>();

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

                    this.initialized = true;
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
            this.appdata = {};
        }
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

    public getSysinfo() {
        let sysinfo = this.http.get(this.getBackendUrl() + '/sysinfo');
        sysinfo.subscribe(
            (res: any) => {
                if (res) {
                    this.data.languages = res.languages;
                    this.data.backendextensions = res.extensions;
                    this.data.systemparameters = res.systemsettings;
                    this.loaded$.emit(true);
                }
            },
            (err: any) => {
                // this.toast.sendToast('error connecting to Backend', 'error', 'please contact your System administrator');
            });
        return sysinfo;
    }

    public getSystemParamater(parameter) {
        try {
            return this.data.systemparameters[parameter];
        } catch (e) {
            return false;
        }
    }

    public checkCapability(capability) {
        return this.data.backendextensions && this.data.backendextensions.hasOwnProperty(capability);
    }

    public getCapabilityConfig(capability) {
        try {
            return (this.data.backendextensions[capability] && this.data.backendextensions[capability].config) ? this.data.backendextensions[capability].config : {}
        } catch (e) {
            return {};
        }
    }

    public setData(key, data) {
        this.appdata[key] = data;
    }

    public getData(key) {
        return this.appdata[key] ? this.appdata[key] : false;
    }
}
