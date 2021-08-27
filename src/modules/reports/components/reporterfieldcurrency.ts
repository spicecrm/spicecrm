/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * display formatted report record value with currency
 */
@Component({
    selector: 'reporter-field-currency',
    templateUrl: './src/modules/reports/templates/reporterfieldcurrency.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldCurrency implements OnInit {
    /**
     * report full record
     */
    private record: any = {};
    /**
     * report field
     */
    private field: any = {};
    /**
     * display value
     */
    private value: string = '';
    /**
     * display currency symbol
     */
    private currencySymbol: string = '';

    constructor(private currency: currency, private userpreferences: userpreferences) {

    }

    /**
     * call to set the display value
     */
    public ngOnInit() {
        this.setCurrencySymbol();
        this.setFormattedFieldValue();
    }

    /**
     * set currency symbol
     */
    private setCurrencySymbol() {

        if (!this.record[this.field.fieldid]) return;

        let currencyId = -99;

        const fieldCurrencyId = this.field.fieldid + '_curid';
        const currencies = this.currency.getCurrencies() || [];

        if (fieldCurrencyId) {
            currencyId = this.record[fieldCurrencyId];
        }
        const currency = currencies.find(currency => currency.id == currencyId);
        this.currencySymbol = currency ? currency.symbol : '';
    }

    /**
     * set formatted field value
     */
    private setFormattedFieldValue() {

        if (this.record[this.field.fieldid]) {
            this.value = this.userpreferences.formatMoney(parseFloat(this.record[this.field.fieldid]));
        } else {
            this.value = '';
        }
    }
}
