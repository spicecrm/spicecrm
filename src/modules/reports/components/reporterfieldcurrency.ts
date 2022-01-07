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
    templateUrl: '../templates/reporterfieldcurrency.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldCurrency implements OnInit {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};
    /**
     * display value
     */
    public value: string = '';
    /**
     * display currency symbol
     */
    public currencySymbol: string = '';

    constructor(public currency: currency, public userpreferences: userpreferences) {

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
    public setCurrencySymbol() {

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
    public setFormattedFieldValue() {

        if (this.record[this.field.fieldid]) {
            this.value = this.userpreferences.formatMoney(parseFloat(this.record[this.field.fieldid]));
        } else {
            this.value = '';
        }
    }
}
