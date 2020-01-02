/**
 * @module services
 */
import {
    Injectable,
} from '@angular/core';

/**
 * a service which provides app-wide data, mostly used for administration
 * author: Sebastian Franz
 */
@Injectable()
export class appdata {
    private _modules = [];

    private _appData: any = {};

    constructor(
    ) {
    }


    public setAppData(key, data) {
        this._appData[key] = data;
    }

    public getAppData(key) {
        return this._appData[key];
    }
}
