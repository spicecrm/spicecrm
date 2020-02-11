/**
 * @module ModuleSpicePath
 */
import {
    Component,
    Input
} from '@angular/core';
import {currency} from '../../../services/currency.service';

declare var _: any;

/**
 * displays the kanban SUM
 */
@Component({
    selector: 'spice-kanban-sumfield',
    templateUrl: './src/include/spicepath/templates/spicekanbansumfield.html'
})
export class SpiceKanbanSumField {

    /**
     * the number to be displayed
     */
    @Input() private value: any;
    @Input() private title: string;

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];
    private loadLabel: boolean = false;
    constructor(private currency: currency) {
        this.currencies = this.currency.getCurrencies();
    }

    /**
     * helper to get the currency symbol
     */
    private getCurrencySymbol(): string {
        let currencySymbol: string;
        let currencyid = -99;

        this.currencies.some(currency => {
            if (currency.id == currencyid) {
                currencySymbol = currency.symbol;
                return true;
            }
        });
        return currencySymbol;
    }
}
