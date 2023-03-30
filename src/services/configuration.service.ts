/**
 * @module services
 */
import {EventEmitter, Injectable} from '@angular/core';

import {session} from './session.service';
import {broadcast} from './broadcast.service';

import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {BehaviorSubject} from "rxjs";
import {SpiceInstaller} from "../include/spiceinstaller/components/spiceinstaller";
import {StoreService} from "./store.service";

/**
 * holds application configuration
 */
@Injectable()
export class configurationService {

    /**
     * set to true if sysinfo returned 503/crmNotInstalled so the installer can run
     */
    public enableinstall: boolean = false;

    /**
     * set to true once the service loaded itself
     */
    public initialized: boolean = false;

    /**
     * set to true if the sysinfo is getting reloaded
     */
    public reloading: boolean = false;

    /**
     * holds general system data retrieved from sysinfo call
     */
    public data: any = {
        backendUrl: 'api',
        backendextensions: {},
        systemparameters: {},
        theme: {},
        name: 'SpiceCRM',
        displayloginsidebar: false
    };

    /**
     * the assets retrieved from the sysinfo
     */
    public assets: any[] = [];

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
    public keysLoaderTaskID: { [key: string]: string } = {};

    private storeDBName: string = 'config';

    constructor(public http: HttpClient,
                public session: session,
                public broadcast: broadcast,
                public title: Title,
                public storeService: StoreService,
                public router: Router,) {

        // add a new behaviour subject
        this.loaded$ = new BehaviorSubject<boolean>(false);

        this.getSysinfo();

        this.storeService.initializeStores(this.storeDBName, ['appdata'], 'id')
            .then(() =>
                this.storeService.readStoreAll(this.storeDBName, 'appdata')
            )
            .then((data: { id: string, data }[]) => {
                data.forEach(d => this.appdata[d.id] = d.data)
            });


        // add a listener to the broadcast to catch the logout
        this.broadcast.message$.subscribe(message => this.handleLogout(message));

        // Update Theme when configuration has been loaded.
        // this.loaded$.subscribe(() => this.updateThemeColors());
    }

    /**
     * returns the system name
     */
    get systemName() {
        return this.data.name ? this.data.name : 'SpiceCRM';
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
     * clears the db
     *
     * @private
     */
    public clearDB() {
        this.storeService.clearDB(this.storeDBName, ['appdata']);
    }

    /**
     * resets the complete app data object
     */
    public reset() {
        this.appdata = {};
        this.clearDB();
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
        sysinfo.subscribe({
            next: (res: any) => {
                if (res) {
                    this.data.languages = res.languages;
                    this.data.backendextensions = res.extensions;
                    this.data.systemparameters = res.systemsettings;
                    this.data.socket_frontend = res.socket_frontend;
                    this.data.unique_key = res.unique_key;
                    this.data.displayloginsidebar = res.displayloginsidebar;
                    this.data.loginSidebarUrl = res.loginSidebarUrl;
                    this.data.allowForgotPass = res.allowForgotPass;
                    this.data.name = res.name ? res.name : 'SpiceCRM';
                    this.loaded$.next(true);
                }
                this.initialized = true;
                this.reloading = false;

                if (res.assets) {
                    this.setAssets(res.assets);
                }

                // set the favicon
                // ToDo: move to separate theming service
                this.setFavIcon();

                // set the title
                this.title.setTitle(this.systemName);
            },
            error: (err: any) => {
                // if we figure the system is not installed add the route to the routes available so it can also be called and redirect to the installer
                if (err.status == '503' && err.error.error.errorCode == 'crmNotInstalled') {
                    this.enableinstall = true;
                    this.router.config.unshift({
                        path: 'install',
                        component: SpiceInstaller
                    });
                    this.router.navigate(['/install']);
                }
            }
        });
        return sysinfo;
    }

    /**
     * gets a specific assetvalue and returns it or undefined
     *
     * @param asset
     */
    public getAsset(asset) {
        if (this.assets && this.assets.find(a => a.assetkey == asset)?.assetvalue) {
            return this.assets.find(a => a.assetkey == asset).assetvalue;
        }
        return undefined;
    }

    /**
     * sets the asset
     *
     * @param asset
     * @param value
     */
    public setAsset(asset, value) {
        let index = this.assets.findIndex(a => a.assetkey == asset);
        if (index >= 0) {
            this.assets[index].assetvalue = value;
        } else {
            this.assets.push({assetkey: asset, assetvalue: value});
        }

        this.loaded$.next(true);
    }

    /**
     * sets the assets
     * @param assets
     * @param emit
     */
    public setAssets(assets, emit = false) {
        this.assets = assets;

        this.setColors();

        if (emit) this.loaded$.next(true);
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
     * @param updateStore
     */
    public setData(key, data, updateStore = true) {

        this.appdata[key] = data;
        // write also to the store
        this.storeService.writeStore(this.storeDBName, 'appdata', {id: key, data});

        // emit the key
        this.datachanged$.emit(key);

        if (!updateStore || !this.keysLoaderTaskID[key]) return;

        // update the stored load task data
        this.storeService.readStore('loaddata', 'loadtaskdata', this.keysLoaderTaskID[key]).subscribe({
            next: (storeData) => {
                storeData[key] = this.appdata[key];
                this.storeService.writeStore('loaddata', 'loadtaskdata', {id: this.keysLoaderTaskID[key], data: storeData});
            }
        });
    }

    /**
     * set the app data from the store and save the load task id, which the passed data are related to
     * @param id
     * @param key
     * @param data
     */
    public setDataFromStore(id: string, key: string, data) {
        this.keysLoaderTaskID[key] = id;
        this.setData(key, data, false);
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
            'sds-c-button-text-color-hover',
            'sds-c-icon-color-foreground'
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

    /**
     * sets the colors
     *
     * @private
     */
    private setColors() {
        // chek that we have colors
        if (!this.getAsset('colors')) return;

        // get the color object
        let colorObj = JSON.parse(this.getAsset('colors'));
        for (let assetColor in colorObj) {
            document.documentElement.style.setProperty('--' + assetColor, colorObj[assetColor]);
        }

    }

}
