/**
 * @module services
 */
import {
    Injectable,
} from '@angular/core';

// import {backend} from "./backend.service";


/**
 * a service which provides app-wide data, mostly used for administration
 * author: Sebastian Franz
 */
@Injectable()
export class AppDataService {
    private _modules = [];

    private _appData: any = {};

    constructor(
        // private backend: backend
    ) {
        // this.loadModules();
    }

    /*
    get modules() {
        return this._modules;
    }

    private loadModules() {
        this.backend.getRequest('spiceui/admin/modules')
            .subscribe(modules => {
                this._modules = modules;
            });
    }
    */

    public setAppData(key, data) {
        this._appData[key] = data;
    }

    public getAppData(key) {
        return this._appData[key];
    }

}