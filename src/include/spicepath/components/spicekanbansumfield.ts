/**
 * @module ModuleSpicePath
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {interval} from "rxjs";
import {take} from "rxjs/operators";

declare var _: any;

@Component({
    selector: 'spice-kanban-sumfield',
    templateUrl: './src/include/spicepath/templates/spicekanbansumfield.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceKanbanSumField implements OnChanges {

    /**
     * the internal held value
     */
    private _value: number = 0;

    /**
     * the number to be displayed
     */
    @Input() private value: any;

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    constructor(private userpreferences: userpreferences, private currency: currency, private cdref: ChangeDetectorRef) {
        this.currencies = this.currency.getCurrencies();
    }

    /**
     * register on changes to trigger the counter
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        const steps = 20;
        const totaltime = 300;
        const _increment = (parseFloat(this.value) - this._value) / steps;
        interval(totaltime / steps).pipe(take(steps)).subscribe(cx => {
            this._value += _increment;

            // check if we are close enough then set the value to the same avoiding rounding errors
            if (Math.abs(this._value - parseFloat(this.value)) < 1) {
                this._value = parseFloat(this.value);
            }

            // trigger change detection
            this.cdref.detectChanges();
        });
    }

    /**
     * returns the formatted value
     */
    get displayvalue() {
        return this.userpreferences.formatMoney(this._value, 0);
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
