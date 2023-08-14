/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {backend} from "./backend.service";

@Injectable({
    providedIn: 'root'
})
export class currency {
    public currenciesFromBackend: any = [];
    constructor(
        public configuration: configurationService,
        public backend: backend
    ) {
    }

    get currencies() {
        return this.configuration.getData('currencies') ?? [];
    }

    public getCurrencies() {
        let curArray = [];

        for (let currency of this.currencies) {
            curArray.push({
                id: currency.id,
                name: currency.name,
                iso: currency.iso,
                symbol: currency.symbol
            });
        }

        return curArray;
    }

    public getCurrencySmbol(currencyid) {
        let curRecord = this.currencies.find(cur => cur.id == currencyid);
        if (curRecord) {
            return curRecord.symbol;
        } else {
            return '';
        }
    }

}
