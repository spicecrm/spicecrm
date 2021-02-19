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
    templateUrl: './src/systemcomponents/templates/systemdisplaynumber.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemDisplayNumber implements OnChanges {

    /**
     * the number to be displayed
     */
    @Input() private number: any;

    /**
     * the field
     */
    @Input() private currency_id: string;

    /**
     * set thisto ture so no values past the comma sre displayed
     *
     * @private
     */
    @Input() private noDigits: boolean = false;


    constructor(private language: language, private cdRef: ChangeDetectorRef, private currency: currency, private userpreferences: userpreferences) {

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

            return this.noDigits ?  this.userpreferences.formatMoney(this.number, 0) : this.userpreferences.formatMoney(this.number);
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
    private detectChanges() {
        this.cdRef.detectChanges();
    }

}
