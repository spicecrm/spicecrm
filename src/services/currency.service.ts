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
        return this.configuration.getData('currencies') ? this.configuration.getData('currencies') : [];
    }

    public getCurrencies() {
        return this.currencies.map(c => {
            return {
                id: c.id,
                name: c.name,
                iso: c.iso4217,
                symbol: c.currency_symbol
            }
        });
    }

    public getCurrencySymbol(currencyid) {
        let curRecord = this.currencies.find(cur => cur.id == currencyid || (currencyid == '-99' && cur.is_systemcurrency == 1));
        if (curRecord) {
            return curRecord.currency_symbol;
        } else {
            return '';
        }
    }

}
