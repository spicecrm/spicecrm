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
                symbol: c.currency_symbol,
                exchange_rate: c.exchange_rate,
                is_systemcurrency: c.is_systemcurrency
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

    /**
     * convert currency amount from base amount
     * @param currencyId
     * @param amount
     * @param precision
     */
    public convertFromBase(currencyId: string, amount: number, precision: number = 6): number {

        const systemCurrency = this.currencies.find(cur => cur.is_systemcurrency == 1);

        if (currencyId === systemCurrency.id) {
            return amount;
        }

        const currency = this.currencies.find(cur => cur.id == currencyId);

        if (!currency.exchange_rate) {
            return amount;
        }

        const convertedAmount = amount * currency.exchange_rate;
        const multiplier = Math.pow(10, precision);
        return Math.round(convertedAmount * multiplier) / multiplier;
    }
}
