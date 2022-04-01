/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';

import {session} from './session.service';
import {broadcast} from './broadcast.service';

import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {BehaviorSubject, Observable, Subject, throwError} from "rxjs";

import {Md5} from "ts-md5";

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
    public appdata: any = {};

    /**
     * emits when the systemparamaters have been laoded
     */
    public loaded$: BehaviorSubject<boolean>;

    /**
     * emits when a data with a give key is changed
     */
    public datachanged$: EventEmitter<string> = new EventEmitter<string>();

    public locationHash: string;

    /**
     * handler to the indexed DB
     *
     * @private
     */
    private db: any;

    constructor(public http: HttpClient,
                public session: session,
                public broadcast: broadcast,
                public title: Title,
                public router: Router,) {

        // add a new behaviour subject
        this.loaded$ = new BehaviorSubject<boolean>(false);

        // open a DB for the config
        this.openDB('config').then(
            db => {
                this.db = db;
                // reinitialize from the database
                this.readStoreAll('appdata').subscribe({
                    next: (data) => {
                        for(let d of data){
                            this.appdata[d.id] = d.data;
                        }
                    }
                })
            }
        );

        this.locationHash = Md5.hashStr('spiceuisites' + window.location.origin + window.location.pathname).toString();
        let storedSites = localStorage.getItem(this.locationHash);

        if (storedSites) {
            this.sites = JSON.parse(atob(storedSites));

            let siteHash = Md5.hashStr('spiceuibackend' + window.location.origin + window.location.pathname).toString();
            let selectedsite = sessionStorage.getItem(siteHash);

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
                        localStorage.setItem(this.locationHash, btoa(JSON.stringify(sites)));

                        if (!this.data.id) {
                            let siteHash = Md5.hashStr('spiceuibackend' + window.location.origin + window.location.pathname).toString();
                            let selectedsite = sessionStorage.getItem(siteHash);
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
    public handleLogout(message) {
        if (message.messagetype == 'logout') {
            this.reset();
        }
    }


    /**
     * opens an indexed DB in the browser to store the config data
     *
     * @param dbname
     * @private
     */
    private openDB(dbname): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            if (!indexedDB) {
                reject('IndexedDB not available');
            }
            const request = indexedDB.open(dbname, 2);
            let db: IDBDatabase;
            request.onsuccess = (event: Event) => {
                db = request.result;
                resolve(db);
            };
            request.onerror = (event: Event) => {
                reject(`IndexedDB error: ${request.error}`);
            };
            request.onupgradeneeded = (event: Event) => {
                db = request.result;
                db.createObjectStore("appdata", {keyPath: "id"});
                resolve(db);
            };
        });
    }

    /**
     * writes a data set record to the db
     * @param id
     * @param data
     */
    public writeStore(store, id, data) {
        // just return if we do not have a db
        if(!this.db) return;

        // process the write
        id = id.toLowerCase();
        this.db.transaction([store], "readwrite").objectStore(store).put({data, id});
    }

    /**
     * reads a data set record from the DB
     * @param id
     */
    public readStore(store, id?): Observable<any> {
        // if we do not have a db return an empty array
        if(!this.db) return throwError(() => new Error('no indexedDB Support'));

        let retSubject = new Subject<any>();
        let transaction = this.db.transaction([store], "readwrite");
        let objectStore = transaction.objectStore(store);
        let request = objectStore.get(id);
        request.onerror = (event) => {
            retSubject.error(false);
        };
        request.onsuccess = (event) => {
            if(event.target.result?.data) {
                retSubject.next(event.target.result.data);
                retSubject.complete();
            } else {
                retSubject.error(false);
            }
        };
        return retSubject.asObservable();
    }

    /**
     * reads all records from the DB in form of an array with the data attribute
     *
     * @param id
     */
    public readStoreAll(store): Observable<any> {
        // if we do not have a db return an empty array
        if(!this.db) return throwError(() => new Error('no indexedDB Support'));

        // process the request
        let retSubject = new Subject<any>();
        let transaction = this.db.transaction([store], "readwrite");
        let objectStore = transaction.objectStore(store);
        let request = objectStore.getAll()
        request.onerror = (event) => {
            retSubject.error(false);
        };
        request.onsuccess = (event) => {
            if(event.target.result && event.target.result.length > 0) {
                let records = [];
                for(let r of event.target.result){
                    records.push(r);
                }
                retSubject.next(records);
                retSubject.complete();
            } else {
                retSubject.error(false);
            }
        };
        return retSubject.asObservable();
    }

    /**
     * clears the db
     *
     * @private
     */
    public clearDB(){
        // only if we have a database
        if(!this.db) return;

        // clear the database
        let transaction = this.db.transaction(["appdata"], "readwrite");
        transaction.objectStore('appdata').clear();
    }

    /**
     * resets the complete app data object
     */
    public reset() {
        this.appdata = {};
        this.clearDB();
    }

    public setSiteData(data) {
        this.sites.push(data);
        for (let attrname in data) {
            this.data[attrname] = data[attrname];
        } // before: this.data = data;
        // this.session.setSessionData('sites', sites);
        localStorage.setItem(this.locationHash, btoa(JSON.stringify(this.sites)));

        this.getSysinfo();
    }

    public setSiteID(id) {
        this.sites.some(site => {
            if (site.id == id) {
                for (let attrname in site) {
                    this.data[attrname] = site[attrname];
                } // before: this.data = site;
                // this.cookie.setValue('spiceuibackend', id);
                let siteHash = Md5.hashStr('spiceuibackend' + window.location.origin + window.location.pathname).toString();
                sessionStorage.setItem(siteHash, id);
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
        sysinfo.subscribe({
            next: (res: any) => {
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
            error: (err: any) => {
                this.reloading = false;
                this.initialized = true;

                // set the favicon
                // ToDo: move to separate theming service
                this.setFavIcon();

                // this.toast.sendToast('error connecting to Backend', 'error', 'please contact your System administrator');
            }
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

        // write also to the store
        this.writeStore('appdata', key, data);

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
        let allColors = [
            'color-white',
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
            'color-border-brand',
            'sds-c-button-brand-color-background',
            'sds-c-button-neutral-color-background-hover',
            'sds-c-button-brand-color-border-hover',
            'sds-c-button-brand-color-background-active',
            'sds-c-button-brand-color-border-active',
            'sds-c-button-brand-color-background-hover',
            'sds-c-input-shadow-focus',
            'sds-c-textarea-shadow-focus',
            'sds-c-select-shadow-focus',
            'sds-c-button-text-color-hover'
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
        let colorBrandPrimary = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
        if (colorBrandPrimary) document.querySelector('meta[name="theme-color"]').setAttribute('content', colorBrandPrimary);
    }

    /**
     * sets the favicon
     */
    public setFavIcon() {
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
