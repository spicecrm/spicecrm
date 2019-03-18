/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: 'reporter-field-curreny',
    templateUrl: './src/modules/reports/templates/reporterfieldcurrency.html'
})
export class ReporterFieldCurrency {

    private record: any = {};
    private field: any = {};

    private currencies: any[] = [];

    constructor(private currency: currency, private userpreferences: userpreferences) {

        this.currencies = this.currency.getCurrencies();

    }

    get currencyidfield() {
        return this.field.fieldid + '_curid';
    }

    private getCurrencySymbol() {
        let currencySymbol = '';

        if (!this.record[this.field.fieldid]) return currencySymbol;

        let currencyid = -99;
        if (this.currencyidfield) {
            this.record[this.currencyidfield];
        }
        this.currencies.some(currency => {
            if (currency.id == currencyid) {
                currencySymbol = currency.symbol;
                return true;
            }
        })
        return currencySymbol;

    }

    private getValue() {
        if (this.record[this.field.fieldid]) {
            return this.userpreferences.formatMoney(parseFloat(this.record[this.field.fieldid]));
        } else {
            return '';
        }
    }

}