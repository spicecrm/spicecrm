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
import {Injectable, EventEmitter} from '@angular/core';

import {cookie} from './cookie.service';
import {session} from './session.service';
import {broadcast} from './broadcast.service';

import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {BehaviorSubject} from "rxjs";

/**
 * @ignore
 */
declare var _: any;

/**
 * holds application configuration
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
        backendUrl: 'api',
        backendextensions: {},
        systemparameters: {},
        theme: {},
        name: 'SpiceCRM'
    };

    /**
     * holds any app data the application can store with a given key
     */
    private appdata: any = {};

    /**
     * emits when the systemparamaters have been laoded
     */
    public loaded$: BehaviorSubject<boolean>;

    /**
     * emits when a data with a give key is changed
     */
    public datachanged$: EventEmitter<string> = new EventEmitter<string>();

    constructor(private http: HttpClient,
                private cookie: cookie,
                private session: session,
                private broadcast: broadcast,
                private title: Title,
                private router: Router,) {

        // add a new behaviour subject
        this.loaded$ = new BehaviorSubject<boolean>(false);

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
        this.loaded$.subscribe(() => this.updateThemeColors());

        // reload the sites
        http.get('config/sites/')
            .subscribe(
                (data: any) => {
                    let dataObject = data;
                    let sites = dataObject.sites;

                    // if no site is set naviogate to setup screen
                    if (sites.length == 0) {
                        this.router.navigate(['/install']);
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
     * returns the system name
     */
    get systemName() {
        return this.data.name ? this.data.name : 'SpiceCRM';
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
                    this.data.socket_frontend = res.socket_frontend;
                    this.data.unique_key = res.unique_key;
                    this.data.name = res.name ? res.name : 'SpiceCRM',
                        this.loaded$.next(true);
                }
                this.initialized = true;
                this.reloading = false;

                // set the favicon
                // ToDo: move to separate theming service
                this.setFavIcon();

                // set the title
                this.title.setTitle(this.systemName);
            },
            (err: any) => {
                this.reloading = false;
                this.initialized = true;

                // set the favicon
                // ToDo: move to separate theming service
                this.setFavIcon();

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
        return this.data.backendextensions[capability] && this.data.backendextensions[capability].config && Object.keys(this.data.backendextensions[capability].config).length > 0;
    }

    /**
     * sores data ion teh internal key store
     *
     * @param key
     * @param data
     */
    public setData(key, data) {
        // console.log('setData',key,data);
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
        // console.log('appdata',this.appdata);
        return this.appdata[key] ? this.appdata[key] : false;
    }

    public updateThemeColors() {
        // if ( !this.hasCapabilityConfig('theme') ) return;

        /* list of colors that can be used for theming */
        let allColors = ['color-white',
            'color-grey-3',
            'color-grey-9',
            'color-grey-13',
            'brand-background-primary',
            'brand-primary',
            'brand-primary-active',
            'brand-accessible',
            'brand-accessible-active',
            'brand-header-contrast-cool',
            'brand-text-link',
            'color-background-inverse',
            'color-border-inverse',
            'color-background-success',
            'color-background-success-dark',
            'color-text-link-active',
            'color-progressbar_item-completed',
            'brand-primary-transparent',
            'color-background-alt-inverse',
            'color-border-brand'
        ];

        let theme = this.getCapabilityConfig('theme');
        let colorsOfTheme: {};
        // The in the theme defined colors are stored as json in the config field 'colors'. Parse it:
        try {
            colorsOfTheme = JSON.parse(theme.colors);
        } catch (e) {
            colorsOfTheme = {};
            // console.warn("Color configuration of theme is invalid or empty.", [theme.colors] );
        }
        // Set all possible colors, either with the value of the config or with null. In case of null the browser uses the value set in the css file.
        for (let colorname of allColors) {
            document.documentElement.style.setProperty('--' + colorname, colorsOfTheme[colorname] ? colorsOfTheme[colorname] : null);
        }

        // color brand-primary may be set also by css file. we need it now to set the theme color in meta tag:
        let colorBrandPrimary = document.documentElement.style.getPropertyValue('--brand-primary');
        if (colorBrandPrimary) document.querySelector('meta[name="theme-color"]').setAttribute('content', colorBrandPrimary);
    }

    /**
     * sets the favicon
     */
    private setFavIcon() {
        let icon = document.querySelectorAll("link[ rel ~= 'icon' i]")[0];
        if (icon) {
            let config = this.getCapabilityConfig('theme');
            if (config.icon_image) {
                icon.setAttribute('href', 'data:' + config.icon_image);
            } else {
                icon.setAttribute('href', './config/favicon');
            }
        }
    }

}
