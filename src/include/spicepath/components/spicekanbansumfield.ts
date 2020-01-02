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
    private _increment: number = 0;

    /**
     * the number to be displayed
     */
    @Input() private value: any;

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    private _timer: any;

    constructor(private userpreferences: userpreferences, private currency: currency, private cdref: ChangeDetectorRef) {
        this.currencies = this.currency.getCurrencies();
    }


    public ngOnChanges(changes: SimpleChanges): void {
        let steps = 20;
        let totaltime = 500;
        this._increment = (parseFloat(this.value) - this._value) / steps;
        interval(totaltime / steps).pipe(take(steps)).subscribe(cx => {
            this._value += this._increment;
            this.cdref.detectChanges();

            if(cx == steps - 1) this._value == this.value;
        });
    }


    /*
    public ngOnChanges(changes: SimpleChanges): void {
        this._increment = (parseFloat(this.value) - this._value) / 20;
        this._timer = setInterval(() => {
            if (this._increment < 0) {
                if (this._value <= parseFloat(this.value)) {
                    clearInterval(this._timer);
                    this._value = parseFloat(this.value);
                    this.cdref.detectChanges();
                } else {
                    this._value += this._increment;
                    this.cdref.detectChanges();
                }
            } else {
                if (this._value >= parseFloat(this.value)) {
                    clearInterval(this._timer);
                    this._value = parseFloat(this.value);
                    this.cdref.detectChanges();
                } else {
                    this._value += this._increment;
                    this.cdref.detectChanges();
                }
            }
        }, 10);
    }
    */


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
