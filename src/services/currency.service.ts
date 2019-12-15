/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';

@Injectable()
export class currency {

    constructor(
        private configuration: configurationService
    ) {
    }

    get currencies() {
        return this.configuration.getData('currencies');
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
