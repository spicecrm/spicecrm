/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {broadcast} from './broadcast.service';

@Injectable()
export class googleapiloader {

    apis: Array<any> = [];
    public _apiLoadingPromise: Promise<any>;

    constructor(public broadcast: broadcast, public configuration: configurationService) {
    }

    public _loadScript(): void {
        let script = (<any>document).createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=__onGoogleLoaded&key=' + this.configuration.data.googleAPI;
        script.type = 'text/javascript';

        (<any>document).getElementsByTagName('head')[0].appendChild(script);
    }

    isApiLoaded(): boolean {
        return (<any>window).google && (<any>window).google.maps ? true : false;
    }

    loadApi(): void {
        if (!this._apiLoadingPromise) {
            this._apiLoadingPromise = new Promise((resolve) => {
                (<any>window)['__onGoogleLoaded'] = (ev) => {
                    resolve('google maps api loaded');
                    this.broadcast.broadcastMessage('googleapiloader.maps');
                }

                this._loadScript();
            })
        }
    }
}
