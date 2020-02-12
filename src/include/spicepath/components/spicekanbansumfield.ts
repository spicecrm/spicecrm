/**
 * @module ModuleSpicePath
 */
import {
    Component,
    Input
} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {model} from '../../../services/model.service';

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
    constructor(private currency: currency, private model: model) {
        this.currencies = this.currency.getCurrencies();
    }

    /**
     * checks if value is NAN .. and in this case returns 0 waiting for the value to be set
     */
    get displayValue() {
         return !this.value || isNaN(this.value) ? 0 : this.value;
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
