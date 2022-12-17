/**
 * @module SystemComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy,
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';
import {currency} from '../../services/currency.service';

/**
 * displays a number formatted as number and if a currency id is passed in with the currwency symbol
 */
@Component({
    selector: 'system-display-number',
    templateUrl: '../templates/systemdisplaynumber.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemDisplayNumber implements OnChanges {

    /**
     * the number to be displayed
     */
    @Input() public number: any;

    /**
     * The number of digits after decimal separator
     * @param precision
     */
    @Input('precision') set onPrecisionChange(precision: number){
        this.precision = precision;
    }
    public precision: number;

    /**
     * the field
     */
    @Input() public currency_id: string;

    /**
     * set thisto ture so no values past the comma sre displayed
     *
     * @private
     */
    @Input() public noDigits: boolean = false;

    /**
     * an attribute that can be set and doies not require the value true poassed in
     * @param value
     */
    @Input('system-display-number-nodigits') set inputGrow(value) {
        if (value === false) {
            this.noDigits = false;
        } else {
            this.noDigits = true;
        }
    }

    constructor(public language: language, public cdRef: ChangeDetectorRef, public currency: currency, public userpreferences: userpreferences) {

    }

    /**
     * helper to get the currency symbol
     */
    get currencySymbol(): string {
        if (!this.currency_id) return '';

        let matchedCurrency = this.currency.getCurrencies().find(currency => currency.id == this.currency_id);
        return matchedCurrency ? matchedCurrency.symbol : '';
    }

    /**
     * gets the fornmatted value
     */
    get value() {
        if ((this.number && this.number != '') || this.number === 0) {

            // check if thsi is a string and tehn try to parse to float
            if(typeof(this.number) == "string") this.number = parseFloat(this.number);
            if(this.precision === undefined){
                this.precision = this.userpreferences.toUse.currency_significant_digits;
            }
            return this.noDigits ?  this.userpreferences.formatMoney(this.number, 0) : this.userpreferences.formatMoney(this.number, this.precision);
        }
    }

    /**
     * on changes also trigger the change detection
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.detectChanges();
    }

    /**
     * triggers the change detection when the language is changed
     */
    public detectChanges() {
        this.cdRef.detectChanges();
    }

}
