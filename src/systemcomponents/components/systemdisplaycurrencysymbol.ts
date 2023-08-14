/**
 * @module SystemComponents
 */
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {currency} from '../../services/currency.service';

/**
 * displays a currency Symbol
 */
@Component({
    selector: 'system-display-currency-symbol',
    templateUrl: '../templates/systemdisplaycurrencysymbol.html',
})
export class SystemDisplayCurrencySymbol implements OnChanges{

    /**
     * the valkue for the currency ID
     */
    @Input() public currencyid: string;


    constructor(public cdRef: ChangeDetectorRef, public currency: currency) {

    }

    /**
     * on changes also trigger the change detection
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.cdRef.detectChanges();
    }

    /**
     * helper to get the currency symbol
     */
    get currencySymbol(): string {
        if (!this.currencyid) return '';

        let matchedCurrency = this.currency.getCurrencies().find(currency => currency.id == this.currencyid);
        return matchedCurrency ? matchedCurrency.symbol : '';
    }

}
